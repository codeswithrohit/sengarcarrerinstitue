import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import AdminNav from '@/components/AdminNav';
import { FaUser } from 'react-icons/fa6';
import { FiBarChart2, FiPieChart, FiYoutube, FiX, FiCheckCircle, FiClock ,FiBookOpen} from 'react-icons/fi';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [targetClassFilter, setTargetClassFilter] = useState('all');
    const [batchFilter, setBatchFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Derived state for dynamic Target Class options
    const uniqueClasses = [...new Set(students.map(s => s.targetClass).filter(Boolean))].sort();
    
    const [todayCount, setTodayCount] = useState(0);
    const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
    
    // Enhanced Fees State
    const [totalFees, setTotalFees] = useState('');
    const [admissionFee, setAdmissionFee] = useState(''); 
    const [installmentCount, setInstallmentCount] = useState(1);
    const [installments, setInstallments] = useState([]);
    const [paymentDate, setPaymentDate] = useState('');

    // --- NEW: Test Stats State ---
    const [isTestStatsModalOpen, setIsTestStatsModalOpen] = useState(false);
    const [studentTestStats, setStudentTestStats] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const snapshot = await firebase.firestore().collection('admissions').orderBy('createdAt', 'desc').get();
                const studentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setStudents(studentsData);
                setFilteredStudents(studentsData);
                
                // Calculate today's admissions
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todaysStudents = studentsData.filter(student => {
                    if(!student.createdAt) return false;
                    const studentDate = new Date(student.createdAt.seconds * 1000);
                    return studentDate >= today;
                });
                setTodayCount(todaysStudents.length);
                
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    // Combined Filter Logic
    useEffect(() => {
        let result = students;

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(student => 
                (student.name && student.name.toLowerCase().includes(query)) ||
                (student.mobileNumber && student.mobileNumber.includes(query)) ||
                (student.studentid && student.studentid.toLowerCase().includes(query))
            );
        }

        if (targetClassFilter !== 'all') {
            result = result.filter(student => student.targetClass === targetClassFilter);
        }

        if (batchFilter !== 'all') {
            result = result.filter(student => student.Batch === batchFilter);
        }

        if (startDate || endDate) {
            result = result.filter(student => {
                if (!student.createdAt) return false;
                
                const studentDate = new Date(student.createdAt.seconds * 1000);
                studentDate.setHours(0, 0, 0, 0); 
                
                let isAfterStart = true;
                let isBeforeEnd = true;

                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    isAfterStart = studentDate >= start;
                }

                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999); 
                    isBeforeEnd = studentDate <= end;
                }

                return isAfterStart && isBeforeEnd;
            });
        }

        setFilteredStudents(result);
    }, [searchQuery, targetClassFilter, batchFilter, startDate, endDate, students]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // --- Profile Modal Logic ---
    const openStudentProfile = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        if (student.fees) {
            setTotalFees(student.fees.totalFees || '');
            setAdmissionFee(student.fees.admissionFee || '');
            setInstallments(student.fees.installments || []);
        } else {
            setTotalFees('');
            setAdmissionFee('');
            setInstallments([]);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setTotalFees('');
        setAdmissionFee('');
        setInstallments([]);
    };

    // --- Test Stats Modal Logic ---
    const openTestStatsModal = async (student) => {
        setSelectedStudent(student);
        setIsTestStatsModalOpen(true);
        setIsLoadingStats(true);
        setStudentTestStats([]);
        
        try {
            const db = firebase.firestore();
            
            // 1. Fetch Standard Tests
            const stdSnapshot = await db.collection('testseriesresult').where('userId', '==', student.id).get();
            const stdTests = stdSnapshot.docs.map(doc => ({ id: doc.id, testType: 'Standard', ...doc.data() }));
            
            // 2. Fetch YouTube Tests
            const ytSnapshot = await db.collection('yttestseriesresult').where('userId', '==', student.id).get();
            const ytTests = ytSnapshot.docs.map(doc => ({ id: doc.id, testType: 'YouTube', ...doc.data() }));
            
            // Combine and Process Best Attempts
            let combined = [...stdTests, ...ytTests];
            combined = combined.map(test => {
                let bestAttempt = test;
                if (test.attempts && test.attempts.length > 0) {
                    bestAttempt = test.attempts.reduce((max, a) => ((a.percentage || 0) > (max.percentage || 0) ? a : max), test.attempts[0]);
                }
                const score = bestAttempt.percentage || 0;
                return { ...test, bestScore: score, totalAttempts: test.attempts?.length || 1 };
            });
            
            // Sort by Date Descending
            combined.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
            setStudentTestStats(combined);
            
        } catch (error) {
            console.error("Error fetching test stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const closeTestStatsModal = () => {
        setIsTestStatsModalOpen(false);
        setStudentTestStats([]);
    };

    // --- Fees Logic ---
    const openFeesModal = () => {
        setIsFeesModalOpen(true);
        const today = new Date().toISOString().split('T')[0];
        setPaymentDate(today);
    };

    const closeFeesModal = () => {
        setIsFeesModalOpen(false);
        setInstallmentCount(1);
        if(!selectedStudent?.fees) {
            setAdmissionFee('');
            setTotalFees('');
            setInstallments([]);
        }
    };

    const updateStudentStatus = async (studentId, newStatus) => {
        try {
            await firebase.firestore().collection('admissions').doc(studentId).update({ Status: newStatus });
            setStudents(students.map(student => student.id === studentId ? {...student, Status: newStatus} : student));
        } catch (error) {
            console.error('Error updating student status:', error);
        }
    };

    const handleInstallmentChange = (e) => setInstallmentCount(parseInt(e.target.value) || 1);
    
    const handleInstallmentUpdate = (index, field, value) => {
        const newInstallments = [...installments];
        newInstallments[index][field] = value;
        setInstallments(newInstallments);
    };

    const generateInstallments = () => {
        const newInstallments = [];
        const total = parseFloat(totalFees) || 0;
        const admission = parseFloat(admissionFee) || 0;
        const remainingForInstallments = total - admission;
        const todayStr = new Date().toISOString().split('T')[0];

        if (total <= 0) { alert("Please enter a valid Total Fees amount"); return; }

        if (admission > 0) {
            newInstallments.push({
                title: 'Admission Fee', number: 0, amount: admission.toFixed(2), date: todayStr, mode: 'Cash', paid: false, paidDate: null
            });
        }

        if (installmentCount > 0 && remainingForInstallments > 0) {
            const amountPerInstallment = remainingForInstallments / installmentCount;
            for (let i = 0; i < installmentCount; i++) {
                newInstallments.push({
                    title: `Installment ${i + 1}`, number: i + 1, amount: amountPerInstallment.toFixed(2), date: '', mode: 'Cash', paid: false, paidDate: null
                });
            }
        } else if (remainingForInstallments < 0) {
             alert("Admission fee cannot be greater than Total Fees"); return;
        }
        setInstallments(newInstallments);
    };

    const submitFees = async () => {
        try {
            const feesData = {
                totalFees: parseFloat(totalFees), admissionFee: parseFloat(admissionFee) || 0, installments: installments, lastUpdated: new Date()
            };
            await firebase.firestore().collection('admissions').doc(selectedStudent.id).update({ fees: feesData });
            setSelectedStudent({ ...selectedStudent, fees: feesData });
            setStudents(students.map(student => student.id === selectedStudent.id ? {...student, fees: feesData} : student));
            closeFeesModal();
        } catch (error) { console.error('Error submitting fees:', error); }
    };

    const markAsPaid = async (installmentIndex) => {
        const newInstallments = [...installments];
        newInstallments[installmentIndex].paid = true;
        newInstallments[installmentIndex].paidDate = new Date().toISOString();
        
        try {
            await firebase.firestore().collection('admissions').doc(selectedStudent.id).update({ 'fees.installments': newInstallments });
            setInstallments(newInstallments);
            setSelectedStudent({ ...selectedStudent, fees: { ...selectedStudent.fees, installments: newInstallments } });
            setStudents(students.map(student => student.id === selectedStudent.id ? { ...student, fees: { ...student.fees, installments: newInstallments } } : student));
        } catch (error) { console.error('Error marking installment as paid:', error); }
    };

    const clearFilters = () => {
        setSearchQuery(''); setTargetClassFilter('all'); setBatchFilter('all'); setStartDate(''); setEndDate('');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
            <AdminNav />
            
            <div className="md:ml-64 px-4 py-8 max-w-7xl ">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Management</h1>
                        <p className="text-sm font-semibold text-slate-500 mt-1">Manage admissions, fees, and monitor test performances.</p>
                    </div>
                    <div className="bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100 flex items-center shadow-sm">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mr-3">Total</span>
                        <span className="text-xl font-black text-indigo-700 leading-none">{filteredStudents.length}</span>
                    </div>
                </div>

                {/* Filters Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-5 py-3 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                        <div className="lg:col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Search Name/ID</label>
                            <input 
                                type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all"
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Target Class</label>
                            <select value={targetClassFilter} onChange={(e) => setTargetClassFilter(e.target.value)} className="w-full bg-slate-50 h-10 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all cursor-pointer">
                                <option value="all">All Classes</option>
                                {uniqueClasses.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
                            </select>
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Batch</label>
                            <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="w-full bg-slate-50 h-10 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all cursor-pointer">
                                <option value="all">All Batches</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all" />
                        </div>
                        <div className="lg:col-span-1">
                            <button onClick={clearFilters} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors shadow-sm border border-slate-200">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Join Date</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-sm font-bold text-slate-400 border-dashed border-2 border-slate-100 m-4 rounded-xl">
                                            No students found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-[10px] text-slate-300 font-black w-5">{index + 1}.</span>
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {student.photoURL ? (
                                                            <img className="h-10 w-10 rounded-xl object-cover shadow-sm border border-slate-200" src={student.photoURL} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                                <FaUser className="h-4 w-4 text-indigo-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-slate-800">{student.name}</div>
                                                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">ID: {student.studentid}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700 font-semibold">{student.mobileNumber}</div>
                                                <div className="text-[10px] font-bold text-slate-400 mt-0.5">{student.gender} • {student.dob}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 inline-flex text-[10px] font-black uppercase tracking-wider rounded-md ${
                                                    student.Batch === 'Online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                    {student.Batch} - {student.targetClass}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                                                {formatDate(student.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={student.Status || 'Pending'}
                                                    onChange={(e) => updateStudentStatus(student.id, e.target.value)}
                                                    className={`block w-full py-1.5 px-3 text-xs font-bold rounded-lg border-0 ring-1 outline-none cursor-pointer shadow-sm ${
                                                        student.Status === 'Active' ? 'bg-indigo-50 ring-indigo-200 text-indigo-700' : 'bg-slate-50 ring-slate-200 text-slate-600'
                                                    }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Active">Active</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openStudentProfile(student)} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                                                        Profile
                                                    </button>
                                                    <button onClick={() => openTestStatsModal(student)} className="inline-flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm">
                                                        <FiBarChart2 className="mr-1.5" /> Stats
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- TEST STATS MODAL --- */}
            {isTestStatsModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeTestStatsModal}></div>
                        
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full ">
                            
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        <FiPieChart className="text-indigo-500" /> Test Performance
                                    </h2>
                                    <p className="text-xs font-bold text-slate-500 mt-1">Showing all test attempts for <span className="text-indigo-600">{selectedStudent.name}</span></p>
                                </div>
                                <button onClick={closeTestStatsModal} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                                    <FiX size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6 bg-white min-h-[400px]">
                                {isLoadingStats ? (
                                    <div className="flex flex-col items-center justify-center h-64">
                                        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                        <p className="text-sm font-bold text-slate-500">Compiling student test records...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Quick Stats Summary */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tests</p>
                                                <p className="text-2xl font-black text-slate-800">{studentTestStats.length}</p>
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center">
                                                <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">Avg Score</p>
                                                <p className="text-2xl font-black text-emerald-600">
                                                    {studentTestStats.length > 0 
                                                        ? Math.round(studentTestStats.reduce((acc, test) => acc + test.bestScore, 0) / studentTestStats.length) 
                                                        : 0}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Test List Table */}
                                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Test / Topic Name</th>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                                        <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Attempts</th>
                                                        <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Best Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 bg-white">
                                                    {studentTestStats.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-12 text-center text-sm font-bold text-slate-400 border-dashed border-2 border-slate-50 m-4 rounded-lg">
                                                                No test records found for this student.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        studentTestStats.map((test, index) => (
                                                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-5 py-3">
                                                                    <p className="text-sm font-bold text-slate-800">{index+1}. {test.topic || test.lectureTitle || test.testName || 'Assessment'}</p>
                                                                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{formatDate(test.createdAt)}</p>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                                        test.testType === 'YouTube' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                                    }`}>
                                                                        {test.testType === 'YouTube' ? <FiYoutube /> : <FiBookOpen />} {test.testType}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3 text-xs font-semibold text-slate-600">
                                                                    {test.subject || 'General'}
                                                                </td>
                                                                <td className="px-5 py-3 text-center text-sm font-bold text-slate-700">
                                                                    {test.totalAttempts}
                                                                </td>
                                                                <td className="px-5 py-3 text-right">
                                                                    <span className={`text-sm font-black ${
                                                                        test.bestScore >= 80 ? 'text-emerald-500' : test.bestScore >= 50 ? 'text-amber-500' : 'text-rose-500'
                                                                    }`}>
                                                                        {Math.floor(test.bestScore)}%
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Student Profile Modal --- */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                        
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full">
                            
                            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-5 flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shadow-inner">
                                        {selectedStudent.photoURL ? (
                                            <img className="h-full w-full object-cover" src={selectedStudent.photoURL} alt="" />
                                        ) : (
                                            <FaUser className="h-8 w-8 text-white/70" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{selectedStudent.name}</h2>
                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                            <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-indigo-100 text-[10px] font-bold  tracking-wider">EMAIL/PASSWORD: {selectedStudent.portalLoginEmail}/{selectedStudent.password} </span>
                                            <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Class: {selectedStudent.targetClass}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
                                    <FiX size={24} />
                                </button>
                            </div>
                            
                            <div className="p-6 bg-slate-50">
                                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
                                    <table className="min-w-full text-sm text-left border-collapse">
                                        <tbody>
                                            <tr>
                                                <td colSpan="4" className="px-5 py-3 bg-slate-100/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    Personal & Contact Information
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 w-1/4 border-r border-slate-100 text-xs">Date of Birth</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800 w-1/4 border-r border-slate-100">{selectedStudent.dob}</td>
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 w-1/4 border-r border-slate-100 text-xs">Gender</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800 w-1/4">{selectedStudent.gender}</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Blood Group</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">{selectedStudent.bloodGroup || 'N/A'}</td>
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Gov ID Ref</th>
                                                {/* STRICT REDACTION REQUIREMENT: Government IDs must never be printed */}
                                                <td className="px-5 py-3 font-semibold text-slate-800">{selectedStudent.aadharNumber ? '[Aadhaar Redacted]' : 'N/A'}</td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Mobile Number</th>
                                                <td className="px-5 py-3 font-bold text-indigo-600 border-r border-slate-100">{selectedStudent.mobileNumber}</td>
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Email Address</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800 truncate max-w-[200px]" title={selectedStudent.email}>{selectedStudent.email || 'N/A'}</td>
                                            </tr>

                                            <tr>
                                                <td colSpan="4" className="px-5 py-3 bg-slate-100/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">
                                                    Academic & Family Background
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Previous School</th>
                                                <td colSpan="3" className="px-5 py-3 font-semibold text-slate-800">{selectedStudent.previousSchool}</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Previous Class</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">{selectedStudent.previousClass}</td>
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Result Percentage</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800">{selectedStudent.previousResult}%</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Father's Name</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">{selectedStudent.fatherName}</td>
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Father's Mobile</th>
                                                <td className="px-5 py-3 font-semibold text-slate-800">{selectedStudent.fatherMobile}</td>
                                            </tr>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">Admission Date</th>
                                                <td colSpan="3" className="px-5 py-3 font-semibold text-slate-800">{formatDate(selectedStudent.createdAt)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Fees Structure Table */}
                                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            Financial Details
                                        </h3>
                                        <button onClick={openFeesModal} className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors shadow-sm">
                                            {selectedStudent.fees ? 'Manage Fees' : 'Initialize Fees'}
                                        </button>
                                    </div>
                                    
                                    <div className="p-0">
                                        {selectedStudent.fees ? (
                                            <table className="min-w-full text-sm text-left">
                                                <thead className="bg-white border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-5 py-4 font-bold text-slate-600">Total Approved Fees</th>
                                                        <th colSpan="4" className="px-5 py-4 font-black text-slate-900 text-xl text-right">
                                                            ₹{selectedStudent.fees.totalFees}
                                                        </th>
                                                    </tr>
                                                    <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-400 font-black border-y border-slate-200">
                                                        <th className="px-5 py-2.5">Installment Details</th>
                                                        <th className="px-5 py-2.5">Amount</th>
                                                        <th className="px-5 py-2.5">Due Date</th>
                                                        <th className="px-5 py-2.5 text-center">Status</th>
                                                        <th className="px-5 py-2.5 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {selectedStudent.fees.installments.map((inst, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-5 py-3 font-bold text-slate-800 text-xs">
                                                                {inst.title || `Installment ${inst.number}`}
                                                            </td>
                                                            <td className="px-5 py-3 font-bold text-slate-600 text-xs">₹{inst.amount}</td>
                                                            <td className="px-5 py-3 text-slate-500 text-xs font-semibold">{inst.date || 'TBD'}</td>
                                                            <td className="px-5 py-3 text-center">
                                                                {inst.paid ? (
                                                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                                        Paid
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                                                                        Pending
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3 text-right">
                                                                {!inst.paid && (
                                                                    <button onClick={() => markAsPaid(idx)} className="text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all shadow-sm">
                                                                        Mark Paid
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-sm text-slate-400 font-bold border-2 border-dashed border-slate-100 p-4 inline-block rounded-xl">No fee structure configured.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end">
                                <button onClick={closeModal} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition-colors">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Fees Modal */}
            {isFeesModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-8">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeFeesModal}></div>
                        
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full  flex flex-col overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">Fee Configuration</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1">Configure structure for <span className="text-indigo-600">{selectedStudent.name}</span></p>
                                </div>
                                <button onClick={closeFeesModal} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                                    <FiX size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6 bg-white flex-1 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Fees (₹)</label>
                                        <input type="number" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} disabled={!!selectedStudent?.fees} placeholder="50000"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-slate-800 disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Admission Fee (₹)</label>
                                        <input type="number" value={admissionFee} onChange={(e) => setAdmissionFee(e.target.value)} disabled={!!selectedStudent?.fees} placeholder="10000"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-slate-800 disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Installments</label>
                                        <div className="flex space-x-2">
                                            <input type="number" min="1" value={installmentCount} onChange={handleInstallmentChange} className="w-20 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-center text-slate-800" />
                                            <button onClick={generateInstallments} className="flex-1 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm text-sm">Generate</button>
                                        </div>
                                    </div>
                                </div>
                                
                                {installments.length > 0 && (
                                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-100 text-sm whitespace-nowrap">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Installment</th>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (₹)</th>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                                        <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {installments.map((inst, index) => (
                                                        <tr key={index} className="hover:bg-slate-50/50">
                                                            <td className="px-5 py-3 font-bold text-slate-800 text-xs bg-slate-50/30">{inst.title || `Installment ${inst.number}`}</td>
                                                            <td className="px-5 py-3">
                                                                <input type="number" value={inst.amount} onChange={(e) => handleInstallmentUpdate(index, 'amount', e.target.value)} disabled={inst.paid} 
                                                                    className="w-full min-w-[100px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 disabled:opacity-50 transition-all" />
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <input type="date" value={inst.date} onChange={(e) => handleInstallmentUpdate(index, 'date', e.target.value)} 
                                                                    className="w-full min-w-[140px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none focus:border-indigo-400 transition-all" />
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <select value={inst.mode} onChange={(e) => handleInstallmentUpdate(index, 'mode', e.target.value)} 
                                                                    className="w-full min-w-[120px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 outline-none focus:border-indigo-400 cursor-pointer transition-all">
                                                                    <option value="Cash">Cash</option>
                                                                    <option value="Cheque">Cheque</option>
                                                                    <option value="Bank">Bank Transfer</option>
                                                                    <option value="UPI">UPI</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                                <button onClick={closeFeesModal} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 font-bold text-sm transition-colors shadow-sm">Cancel</button>
                                <button onClick={submitFees} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm transition-colors shadow-sm">Save Configuration</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Students;