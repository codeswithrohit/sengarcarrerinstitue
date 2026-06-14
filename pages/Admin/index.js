import AdminNav from '@/components/AdminNav'
import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';

const Index = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayStudents: 0,
    totalFees: 0,
    totalPaid: 0,
    totalUnpaid: 0
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    filterType: 'none' // 'none', 'single', 'range'
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await firebase.firestore().collection('admissions').orderBy('createdAt', 'desc').get();
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStudents(studentsData);
        
        // Calculate today's admissions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysStudents = studentsData.filter(student => {
          const studentDate = new Date(student.createdAt.seconds * 1000);
          return studentDate >= today;
        });
        
        // Calculate fee statistics
        let totalFees = 0;
        let totalPaid = 0;
        let totalUnpaid = 0;
        
        studentsData.forEach(student => {
          if (student.fees) {
            totalFees += student.fees.totalFees || 0;
            
            if (student.fees.installments) {
              student.fees.installments.forEach(inst => {
                if (inst.paid) {
                  totalPaid += parseFloat(inst.amount) || 0;
                } else {
                  totalUnpaid += parseFloat(inst.amount) || 0;
                }
              });
            }
          }
        });
        
        setStats({
          totalStudents: studentsData.length,
          todayStudents: todaysStudents.length,
          totalFees,
          totalPaid,
          totalUnpaid
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students to show only those with installments in current month or later
  useEffect(() => {
    if (students.length === 0) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const filtered = students.filter(student => {
      if (!student.fees || !student.fees.installments) return false;

      // Check if any installment is in current month or later
      return student.fees.installments.some(installment => {
        const installmentDate = new Date(installment.date);
        return (
          (installmentDate.getFullYear() === currentYear && installmentDate.getMonth() >= currentMonth) ||
          installmentDate.getFullYear() > currentYear
        );
      });
    });

    setFilteredStudents(filtered);
  }, [students]);

  // Apply date filter when user selects specific dates
  useEffect(() => {
    if (dateFilter.filterType === 'none') {
      // Reset to default filter (current month or later)
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const filtered = students.filter(student => {
        if (!student.fees || !student.fees.installments) return false;

        return student.fees.installments.some(installment => {
          const installmentDate = new Date(installment.date);
          return (
            (installmentDate.getFullYear() === currentYear && installmentDate.getMonth() >= currentMonth) ||
            installmentDate.getFullYear() > currentYear
          );
        });
      });

      setFilteredStudents(filtered);
      return;
    }

    const filtered = students.filter(student => {
      if (!student.fees || !student.fees.installments) return false;

      return student.fees.installments.some(installment => {
        const installmentDate = new Date(installment.date);
        installmentDate.setHours(0, 0, 0, 0);

        if (dateFilter.filterType === 'single') {
          const selectedDate = new Date(dateFilter.startDate);
          selectedDate.setHours(0, 0, 0, 0);
          return installmentDate.getTime() === selectedDate.getTime();
        } else if (dateFilter.filterType === 'range') {
          const startDate = new Date(dateFilter.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          return installmentDate >= startDate && installmentDate <= endDate;
        }
        return false;
      });
    });

    setFilteredStudents(filtered);
  }, [dateFilter, students]);

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilter = (filterType) => {
    setDateFilter(prev => ({
      ...prev,
      filterType
    }));
  };

  const clearFilter = () => {
    setDateFilter({
      startDate: '',
      endDate: '',
      filterType: 'none'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹');
  };

  // Get next unpaid installment for a student
  const getNextInstallment = (student) => {
    if (!student.fees || !student.fees.installments) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
    
    const upcomingInstallments = student.fees.installments
      .filter(installment => {
        const installmentDate = new Date(installment.date);
        installmentDate.setHours(0, 0, 0, 0);
        return installmentDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcomingInstallments.length > 0 ? upcomingInstallments[0] : null;
  };

  // Get total paid amount for a student
  const getTotalPaidForStudent = (student) => {
    if (!student.fees || !student.fees.installments) return 0;
    
    return student.fees.installments
      .filter(inst => inst.paid)
      .reduce((sum, inst) => sum + parseFloat(inst.amount), 0);
  };

  // Check if all fees are paid
  const isFullyPaid = (student) => {
    const totalFees = student.fees?.totalFees || 0;
    const totalPaid = getTotalPaidForStudent(student);
    return totalPaid >= totalFees;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      
      <div className="p-6 md:ml-64">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</span>
            <button 
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center"
              onClick={() => window.location.reload()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">{stats.totalStudents}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Today's Students</p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">{stats.todayStudents}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Fees</p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(stats.totalFees)}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Paid</p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(stats.totalPaid)}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Unpaid</p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(stats.totalUnpaid)}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fee Collections Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-700 flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-lg font-semibold text-white mb-4 md:mb-0">Upcoming Fee Collections (Current Month & Later)</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Date Filter Controls */}
              {/* <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                <div className="flex items-center space-x-2">
                  <label htmlFor="startDate" className="text-sm text-blue-100">From:</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={dateFilter.startDate}
                    onChange={handleDateFilterChange}
                    className="px-2 py-1 text-sm rounded border border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => applyFilter('single')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-800 transition-colors"
                  disabled={!dateFilter.startDate}
                >
                  Filter by Date
                </button>
                <button
                  onClick={clearFilter}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-800 transition-colors"
                >
                  Clear Filter
                </button>
              </div> */}
              
              <span className="text-sm text-blue-100">
                Showing {filteredStudents.length} of {students.length} students
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Batch</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Mobile</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Total Fees</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Paid Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Next Installment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const nextInstallment = getNextInstallment(student);
                      const totalPaid = getTotalPaidForStudent(student);
                      const totalFees = student.fees?.totalFees || 0;
                      const isPaid = isFullyPaid(student);
                      
                      // Determine status based on next installment's paid status
                      let nextInstallmentStatus = 'No installments';
                      let statusColor = 'gray';
                      
                      if (nextInstallment) {
                        nextInstallmentStatus = nextInstallment.paid ? 'Paid' : 'Unpaid';
                        statusColor = nextInstallment.paid ? 'green' : 'red';
                      } else if (isPaid) {
                        nextInstallmentStatus = 'All Paid';
                        statusColor = 'green';
                      }

                      return (
                        <tr 
                          key={student.id} 
                          className={`hover:bg-gray-50 ${isPaid ? 'bg-green-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {student.photoURL ? (
                                  <img className="h-10 w-10 rounded-full object-cover" src={student.photoURL} alt={student.name} />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.studentid}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.previousClass || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.targetClass || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.mobileNumber || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {formatCurrency(totalFees)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {formatCurrency(totalPaid)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {nextInstallment ? (
                              <div>
                                <div>{new Date(nextInstallment.date).toLocaleDateString()}</div>
                                <div className="font-medium">{formatCurrency(nextInstallment.amount)}</div>
                                <div className={`text-xs mt-1 ${
                                  nextInstallment.paid ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {nextInstallment.paid ? (
                                    <>
                                      <span>Paid on {new Date(nextInstallment.paidDate).toLocaleDateString()}</span>
                                      <span className="ml-1">({nextInstallment.mode})</span>
                                    </>
                                  ) : 'Pending'}
                                </div>
                              </div>
                            ) : (
                              <span className={isPaid ? "text-green-600" : "text-gray-400"}>
                                {nextInstallmentStatus}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColor === 'green' ? 'bg-green-100 text-green-800' :
                              statusColor === 'red' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {nextInstallmentStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No student records found with upcoming installments
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} records
            </span>
            {/* <div className="flex space-x-4">
              <button className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Payment
              </button>
              <button className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center">
                Export to Excel
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index