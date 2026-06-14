import AdminNav from '@/components/AdminNav'
import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { FiChevronDown, FiChevronUp, FiDollarSign, FiCalendar, FiCreditCard, FiCheckCircle, FiXCircle, FiEye, FiEyeOff, FiPrinter, FiX, FiShare2 } from 'react-icons/fi';

const Fees = () => {
    const [students, setStudents] = useState([]);
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [receiptData, setReceiptData] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [sendStatus, setSendStatus] = useState({ success: false, message: '' });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const snapshot = await firebase.firestore().collection('admissions').orderBy('createdAt', 'desc').get();
                const studentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStudents(studentsData);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const toggleInstallments = (studentId) => {
        if (expandedStudent === studentId) {
            setExpandedStudent(null);
        } else {
            setExpandedStudent(studentId);
        }
    };

    const calculateFeesSummary = (fees) => {
        if (!fees) return { totalFees: 0, totalPaid: 0, totalUnpaid: 0, nextInstallment: null };
        
        const totalFees = fees.totalFees || 0;
        let totalPaid = 0;
        let totalUnpaid = 0;
        let nextInstallment = null;
        const today = new Date();
        
        if (fees.installments && fees.installments.length > 0) {
            fees.installments.forEach(installment => {
                if (installment.paid) {
                    totalPaid += parseFloat(installment.amount) || 0;
                } else {
                    totalUnpaid += parseFloat(installment.amount) || 0;
                    
                    // Check for next installment
                    const installmentDate = new Date(installment.date);
                    if (installmentDate >= today && 
                        (!nextInstallment || installmentDate < new Date(nextInstallment.date))) {
                        nextInstallment = installment;
                    }
                }
            });
            
            // If no future installments, find the first unpaid one
            if (!nextInstallment) {
                const unpaidInstallments = fees.installments.filter(i => !i.paid);
                if (unpaidInstallments.length > 0) {
                    nextInstallment = unpaidInstallments[0];
                }
            }
        }
        
        return { totalFees, totalPaid, totalUnpaid, nextInstallment };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.name?.toLowerCase().includes(searchLower) ||
            student.studentid?.toLowerCase().includes(searchLower) ||
            student.mobileNumber?.includes(searchTerm) ||
            student.targetClass?.toLowerCase().includes(searchLower)
        );
    });

    const getPaymentStatusColor = (paid) => {
        return paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const updateInstallmentStatus = async (studentId, installmentIndex) => {
        try {
            const student = students.find(s => s.id === studentId);
            if (!student || !student.fees || !student.fees.installments) return;

            // Create a copy of the installments array
            const updatedInstallments = [...student.fees.installments];
            
            // Toggle the paid status and set the current date if marking as paid
            const currentDate = new Date().toISOString();
            updatedInstallments[installmentIndex] = {
                ...updatedInstallments[installmentIndex],
                paid: !updatedInstallments[installmentIndex].paid,
                paidDate: !updatedInstallments[installmentIndex].paid ? currentDate : null
            };

            // Update the student document in Firestore
            await firebase.firestore().collection('admissions').doc(studentId).update({
                'fees.installments': updatedInstallments
            });

            // Update the local state
            setStudents(students.map(s => {
                if (s.id === studentId) {
                    return {
                        ...s,
                        fees: {
                            ...s.fees,
                            installments: updatedInstallments
                        }
                    };
                }
                return s;
            }));
        } catch (error) {
            console.error('Error updating installment status:', error);
        }
    };

    const generateReceipt = (student, installment) => {
        const feesSummary = calculateFeesSummary(student.fees);
        const receipt = {
            studentName: student.name,
            studentId: student.studentid,
            mobile: student.mobileNumber,
            installmentNumber: installment.number,
            installmentAmount: installment.amount,
            installmentDate: formatDate(installment.date),
            paidDate: formatDate(installment.paidDate),
            paymentMode: installment.mode || 'Cash',
            totalPaid: feesSummary.totalPaid,
            totalUnpaid: feesSummary.totalUnpaid,
            totalFees: feesSummary.totalFees
        };
        setReceiptData(receipt);
        setShowReceipt(true);
    };

    const printReceipt = () => {
        const printContents = document.getElementById('receipt-content').innerHTML;
        const originalContents = document.body.innerHTML;
        
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    // --- MODIFIED: Text-only WhatsApp Sender ---
    const sendReceiptViaWhatsApp = () => {
        // 1. Check if we have the data
        if (!receiptData || !receiptData.mobile) {
            alert('Cannot send: Student mobile number is missing!');
            setSendStatus({ success: false, message: 'Mobile number not available' });
            return;
        }
    
        try {
            // 2. Format the phone number perfectly
            let phone = receiptData.mobile.toString().replace(/\D/g, ''); // Keep only numbers
            if (phone.length === 10) {
                phone = '91' + phone; // Add India code if missing
            }

            // 3. Create a simpler message string (Standard emojis often work better with this API)
            const message = `Dear *${receiptData.studentName}*,
            
 *Payment Receipt Details*
--------------------------------
 *Installment #${receiptData.installmentNumber}*: ₹${parseFloat(receiptData.installmentAmount).toLocaleString()}
 *Payment Mode*: ${receiptData.paymentMode}
*Payment Date*: ${receiptData.paidDate}
--------------------------------
 *Total Paid*: ₹${parseFloat(receiptData.totalPaid).toLocaleString()}
 *Balance Due*: ₹${parseFloat(receiptData.totalUnpaid).toLocaleString()}
            
Thank you for your payment! 
            
Sengar Carrer Institute
SAI COMPLEX, BENIPUR POKHRA, BENIPUR ROAD, PAHARIYA-221007
📞 +91 9205204647`;

            // 4. Use the Universal WhatsApp API instead of wa.me
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
            
            // DEBUGGING: This will print the exact link in your browser console (Press F12 to see it)
            console.log("GENERATED WHATSAPP LINK:", whatsappUrl);

            // 5. Bypass Popup Blockers by creating a temporary, invisible link
            const link = document.createElement('a');
            link.href = whatsappUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer'; // Security best practice
            document.body.appendChild(link);
            link.click(); // Force the click
            document.body.removeChild(link); // Clean up
            
            setSendStatus({ success: true, message: 'WhatsApp opened successfully!' });
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
            alert('Error opening WhatsApp. Please check the console.');
            setSendStatus({ success: false, message: 'Failed to open WhatsApp' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-36">
            <AdminNav />
            <div className="md:ml-64  px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Student Fees Management</h2>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button 
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setSearchTerm('')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-700 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Fees</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Paid/Unpaid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Next Installment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        const feesSummary = calculateFeesSummary(student.fees);
                                        const paymentProgress = (feesSummary.totalPaid / feesSummary.totalFees) * 100;
                                        
                                        return (
                                            <React.Fragment key={student.id}>
                                                <tr className="hover:bg-blue-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{student.name || '-'}</div>
                                                        <div className="text-sm text-gray-500">{student.mobileNumber || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.studentid || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {student.targetClass || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">₹{feesSummary.totalFees.toLocaleString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className="text-green-600">₹{feesSummary.totalPaid.toLocaleString()}</span>
                                                                <span className="text-red-600">₹{feesSummary.totalUnpaid.toLocaleString()}</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-blue-600 h-2 rounded-full" 
                                                                    style={{ width: `${isNaN(paymentProgress) ? 0 : paymentProgress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {feesSummary.nextInstallment ? (
                                                            <div className="flex items-center">
                                                                <FiCalendar className="mr-2 text-blue-600" />
                                                                <div>
                                                                    <div className="text-sm font-medium">
                                                                        ₹{parseFloat(feesSummary.nextInstallment.amount).toLocaleString()}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {formatDate(feesSummary.nextInstallment.date)}
                                                                    </div>
                                                                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(feesSummary.nextInstallment.paid)}`}>
                                                                        {feesSummary.nextInstallment.paid ? 'Paid' : 'Unpaid'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => toggleInstallments(student.id)}
                                                            className="inline-flex items-center px-3 py-1 border border-blue-600 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            {expandedStudent === student.id ? (
                                                                <>
                                                                    <FiEyeOff className="mr-1" /> Hide
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiEye className="mr-1" /> View
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedStudent === student.id && student.fees?.installments && (
                                                    <tr>
                                                        <td colSpan="7" className="px-0 py-0">
                                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                                <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                                                    <FiCreditCard className="mr-2 text-blue-600" />
                                                                    Installment Details
                                                                </h4>
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full divide-y divide-gray-200">
                                                                        <thead className="bg-blue-50">
                                                                            <tr>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">#</th>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Amount</th>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Due Date</th>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Payment Mode</th>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Paid Date</th>
                                                                                <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                                            {student.fees.installments.map((installment, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{installment.number}</td>
                                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                        ₹{parseFloat(installment.amount).toLocaleString()}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                                        {formatDate(installment.date)}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                                        {installment.mode || '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                                                        {installment.paid ? (
                                                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                                <FiCheckCircle className="mr-1" /> Paid
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                                                <FiXCircle className="mr-1" /> Unpaid
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                                        {installment.paid ? formatDate(installment.paidDate) : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                                        {installment.paid ? (
                                                                                            <button
                                                                                                onClick={() => generateReceipt(student, installment)}
                                                                                                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                                                                            >
                                                                                                View Receipt
                                                                                            </button>
                                                                                        ) : (
                                                                                            <button
                                                                                                onClick={() => updateInstallmentStatus(student.id, index)}
                                                                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                                                                                            >
                                                                                                Mark as Paid
                                                                                            </button>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No students found matching your search criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        
                        {/* Scrollable content container */}
                        <div className="overflow-y-auto flex-1 mt-4">
                            {/* Receipt Content */}
                            <div id="receipt-content" className="p-8">
                                {/* Institution Info */}
                                <div className="flex flex-col items-center mt-8 mb-6">
                                    <div className="w-20 h-20 bg-white rounded-full shadow-md p-1 mb-3 -mt-12 border-4 border-white">
                                        <img className="w-full h-full object-contain" src='/logo.jpeg' alt="Logo" />
                                    </div>
                                    <h1 className="text-xl font-bold text-gray-800">Sengar Carrer Institute</h1>
                                    <p className="text-sm text-gray-500">त्रिबंधु's Nurtue Nature & Future</p>
                                </div>
                                
                                {/* Transaction Summary Card */}
                                <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Transaction ID</p>
                                            <p className="font-mono font-medium">#{Math.floor(Math.random() * 1000000)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="font-medium">{receiptData.paidDate}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Student</span>
                                            <span className="font-medium">{receiptData.studentName} (ID: {receiptData.studentId})</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mobile</span>
                                            <span className="font-medium">{receiptData.mobile}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Payment Details */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <FiCreditCard className="mr-2 text-indigo-600" />
                                        Payment Information
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Installment No</span>
                                            <span className="font-medium">{receiptData.installmentNumber}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Payment Method</span>
                                            <span className="font-medium">{receiptData.paymentMode}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-600">Amount Paid</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ₹{parseFloat(receiptData.installmentAmount).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-600">Amount Payment Date</span>
                                            <span className="text-xl font-bold ">
                                                {(receiptData.paidDate).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Fees Summary */}
                                <div className="bg-indigo-50 rounded-xl p-5 mb-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Fees Summary</h4>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Fees</span>
                                            <span className="font-medium">₹{parseFloat(receiptData.totalFees).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Paid</span>
                                            <span className="font-medium text-green-600">₹{parseFloat(receiptData.totalPaid).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-indigo-100">
                                            <span className="font-medium">Balance Due</span>
                                            <span className="font-bold text-red-600">₹{parseFloat(receiptData.totalUnpaid).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status and Message */}
                                <div className="text-center p-4 bg-green-50 rounded-lg mb-6">
                                    <div className="inline-flex items-center text-green-600 mb-2">
                                        <FiCheckCircle className="mr-2" size={20} />
                                        <span className="font-medium">Payment Successful</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Thank you for your payment. This receipt has been generated electronically and is valid without signature.
                                    </p>
                                </div>
                                
                                {/* Footer */}
                                <div className="text-center text-xs text-gray-500">
                                    <p>For any queries, contact us at 98076 78581</p>
                                    <p className="mt-1">PANCHKOSHI RD, JAI NAGAR COLONY, GILAT BAZAR, VARANASI, UTTAR PRADESH 221002</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between gap-3 border-t border-gray-200">
                            <button 
                                onClick={printReceipt}
                                className="flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                            >
                                <FiPrinter className="mr-2" /> 
                                <span className="text-sm sm:text-base">Print Receipt</span>
                            </button>
                            <button 
                                onClick={sendReceiptViaWhatsApp}
                                className="flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                            >
                                <FiShare2 className="mr-2" /> 
                                <span className="text-sm sm:text-base">Send via WhatsApp</span>
                            </button>
                            <button 
                                onClick={() => setShowReceipt(false)}
                                className="flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
                            >
                                <span className="text-sm sm:text-base">Close</span>
                            </button>
                        </div>
                        {sendStatus.message && (
                            <div className={`px-6 py-2 text-sm ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {sendStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fees;