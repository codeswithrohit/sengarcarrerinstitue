import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import StudentNav from '../StudentNav'; 
import { 
  FiPieChart, FiDollarSign, FiClock, FiCheckCircle, 
  FiBookOpen, FiTrendingUp, FiAlertCircle, FiYoutube
} from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [ytTestResults, setYtTestResults] = useState([]); // New state for YouTube tests
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async (user) => {
      try {
        const db = firebase.firestore();

        // 1. Fetch Profile & Fees
        const profileDoc = await db.collection('admissions').doc(user.uid).get();
        if (profileDoc.exists) setStudentData(profileDoc.data());

        // 2. Fetch Regular Tests
        const resultsSnapshot = await db.collection('testseriesresult').where('userId', '==', user.uid).get();
        const results = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        results.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
        setTestResults(results);

        // 3. Fetch YouTube Tests
        const ytSnapshot = await db.collection('yttestseriesresult').where('userId', '==', user.uid).get();
        const ytResults = ytSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        ytResults.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
        setYtTestResults(ytResults);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) fetchDashboardData(user);
      else router.push('/');
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <StudentNav />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-indigo-200 rounded-full mb-4"></div>
            <div className="h-3 w-24 md:h-4 md:w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 w-32 md:h-4 md:w-48 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- CALCULATE FEE METRICS ---
  const totalFees = Number(studentData?.fees?.totalFees) || 0;
  const installments = studentData?.fees?.installments || [];
  const paidFees = installments.filter(inst => inst.paid || inst.paidDate).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingFees = totalFees - paidFees;
  const feeProgress = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;
  const nextInstallment = installments.find(inst => !(inst.paid || inst.paidDate));

  // --- CALCULATE TEST METRICS (Combined Regular + YouTube) ---
  const allTests = [...testResults, ...ytTestResults];
  const totalTestsAttempted = allTests.length;
  const averageScore = totalTestsAttempted > 0 
    ? Math.round(allTests.reduce((acc, curr) => {
        const bestAttempt = curr.attempts 
          ? curr.attempts.reduce((max, a) => ((a.percentage || 0) > (max.percentage || 0) ? a : max), curr.attempts[0])
          : curr;
        return acc + (bestAttempt.percentage || 0);
      }, 0) / totalTestsAttempted)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-8 md:pb-12">
      <StudentNav />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-4 md:pt-8">
        
        {/* Welcome Header */}
        <div className="mb-4 md:mb-8 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Welcome, {studentData?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-500 mt-0.5">
              {studentData?.admissionFor} • {studentData?.Batch}
            </p>
          </div>
          {nextInstallment && (
            <div className="w-full md:w-auto bg-rose-50 border border-rose-100 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl flex items-center">
              <FiAlertCircle className="text-rose-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-[10px] md:text-xs font-bold text-rose-700 uppercase tracking-wide">Next Due: {nextInstallment.date || 'TBD'}</p>
                <p className="text-sm md:text-base font-black text-rose-900">₹{Number(nextInstallment.amount).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- KPI STAT CARDS --- */}
        <div className="grid grid-cols-4 gap-1.5 md:gap-4 mb-6 md:mb-8">
          <StatCard title="Total Fees" value={`₹${(totalFees / 1000).toFixed(1)}k`} icon={<FiBookOpen />} bg="bg-indigo-50 text-indigo-600" />
          <StatCard title="Dues" value={`₹${(pendingFees / 1000).toFixed(1)}k`} icon={<FiClock />} bg="bg-amber-50 text-amber-600" />
          <StatCard title="Total Tests" value={totalTestsAttempted} icon={<FiCheckCircle />} bg="bg-emerald-50 text-emerald-600" />
          <StatCard title="Avg Score" value={`${averageScore}%`} icon={<FiTrendingUp />} bg="bg-blue-50 text-blue-600" />
        </div>

        {/* --- DETAILED WIDGETS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
          
          {/* Left Column: Fee Overview */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center mb-4 md:mb-6">
              <FiDollarSign className="mr-2 text-emerald-500" /> Fee Overview
            </h2>

            <div className="mb-5 md:mb-6">
              <div className="flex justify-between text-[10px] md:text-sm font-bold mb-1.5">
                <span className="text-slate-600">Paid: ₹{paidFees.toLocaleString()}</span>
                <span className="text-emerald-600">{feeProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 md:h-3">
                <div className="bg-emerald-500 h-2 md:h-3 rounded-full transition-all duration-500" style={{ width: `${feeProgress}%` }}></div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              {installments.slice(0, 4).map((inst, idx) => {
                const isPaid = inst.paid || inst.paidDate;
                return (
                  <div key={idx} className="flex justify-between items-center p-2.5 md:p-3 rounded-lg md:rounded-xl border border-slate-100 bg-slate-50">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{inst.title || `Inst. ${inst.number}`}</p>
                      <p className="text-[10px] md:text-xs font-semibold text-slate-500 truncate">
                        {isPaid ? `Paid ${new Date(inst.paidDate).toLocaleDateString()}` : `Due: ${inst.date ? new Date(inst.date).toLocaleDateString() : 'TBD'}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-black text-slate-900 mb-0.5">₹{Number(inst.amount).toLocaleString()}</p>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded block text-center ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {installments.length > 4 && (
                <button onClick={() => router.push('/Student/Profile')} className="w-full py-1.5 md:py-2 mt-2 text-[11px] md:text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-md md:rounded-lg transition-colors">
                  View All
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Combined Test Performances */}
          <div className="flex flex-col gap-4 md:gap-6 min-w-0">
            
            {/* Standard Assessments */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 flex-1">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center mb-4">
                <FiPieChart className="mr-2 text-blue-500" /> Recent Assessments
              </h2>

              {testResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 md:h-40 text-center bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                  <FiBookOpen className="text-slate-300 text-2xl md:text-3xl mb-2" />
                  <p className="text-[11px] md:text-sm font-bold text-slate-500">No assessments found.</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {testResults.slice(0, 3).map((test, idx) => {
                    const bestAttempt = test.attempts ? test.attempts.reduce((max, a) => ((a.percentage || 0) > (max.percentage || 0) ? a : max), test.attempts[0]) : test;
                    const score = bestAttempt.percentage || 0;
                    return (
                      <div key={idx} className="flex justify-between items-center p-2.5 md:p-3 rounded-lg md:rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => router.push(`/Student/mytestresult?id=${test.id}`)}>
                        <div className="min-w-0 pr-2 flex-1">
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 mb-0.5 truncate">{test.lectureTitle || test.testName || `Assessment`}</h4>
                          <div className="flex items-center text-[10px] md:text-xs font-medium text-slate-500">
                            <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 mr-2 truncate max-w-[80px]">{test.subject || 'Subject'}</span>
                            <span className="truncate">{bestAttempt.correctAnswers || 0}/{bestAttempt.totalQuestions || 0} Correct</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 ml-2">
                          <span className={`text-sm md:text-lg font-black leading-none ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{score}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* NEW: YouTube Learning Progress & Trends */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 flex-1">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center mb-4">
                <FiYoutube className="mr-2 text-red-500" /> YouTube Learning
              </h2>

              {ytTestResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 md:h-40 text-center bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                  <FiYoutube className="text-slate-300 text-2xl md:text-3xl mb-2" />
                  <p className="text-[11px] md:text-sm font-bold text-slate-500">No YouTube tests taken yet.</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {ytTestResults.slice(0, 3).map((test, idx) => {
                    const attempts = test.attempts || [];
                    const bestAttempt = attempts.reduce((max, a) => ((a.percentage || 0) > (max.percentage || 0) ? a : max), attempts[0]);
                    const score = bestAttempt?.percentage || 0;
                    
                    // Prepare attempt data for the mini trend line
                    const trendData = attempts.map(a => Number(a.percentage || 0));
                    const showTrend = trendData.length > 1;

                    return (
                      <div key={idx} className="flex justify-between items-center p-2.5 md:p-3 rounded-lg md:rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => router.push(`/Student/testresult?id=${test.id}`)}>
                        
                        <div className="min-w-0 pr-2 flex-1">
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 mb-0.5 truncate">{test.topic || test.lectureTitle || `Lesson`}</h4>
                          <div className="flex items-center text-[10px] md:text-xs font-medium text-slate-500">
                            <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 mr-2 truncate max-w-[80px]">{test.subject || 'Subject'}</span>
                            <span className="truncate">{attempts.length} Attempts</span>
                          </div>
                        </div>
                        
                        {/* Mini Trend Graph inside the list item */}
                        {showTrend ? (
                          <div className="w-16 sm:w-24 h-8 sm:h-10 mx-2 hidden sm:block">
                             <Line
                                data={{
                                  labels: trendData.map((_, i) => i),
                                  datasets: [{
                                    data: trendData,
                                    borderColor: score >= 80 ? '#10B981' : '#F43F5E',
                                    borderWidth: 2,
                                    tension: 0.4,
                                    pointRadius: 0,
                                  }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } }, plugins: { legend: { display: false }, tooltip: { enabled: false } } }}
                              />
                          </div>
                        ) : (
                          <div className="w-16 sm:w-24 h-8 mx-2 hidden sm:block"></div> // Spacer
                        )}

                        <div className="flex flex-col items-end flex-shrink-0 ml-2">
                          <span className={`text-sm md:text-lg font-black leading-none ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{score}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, bg = "bg-slate-100 text-slate-600", icon }) => (
  <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-slate-100 flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-1 sm:gap-2 md:gap-3 overflow-hidden">
    {icon && (
      <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 rounded-full md:rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs md:text-xl ${bg}`}>
        {icon}
      </div>
    )}
    <div className="text-center xl:text-left min-w-0 w-full">
      <p className="text-[8px] sm:text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-tighter sm:tracking-wide truncate mb-0.5">{title}</p>
      <p className="text-[11px] sm:text-xs md:text-base lg:text-lg font-black text-slate-800 leading-none truncate">{value}</p>
    </div>
  </div>
);

export default Dashboard;