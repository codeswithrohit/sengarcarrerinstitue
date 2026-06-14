import React, { useEffect, useState, useMemo } from 'react';
import StudentNav from '../StudentNav';
import { firebase } from '../../Firebase/config';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { 
  FiBookOpen, 
  FiCheckCircle, 
  FiClock, 
  FiPlay,
  FiRotateCcw,
  FiBarChart2,
  FiCalendar,
  FiChevronDown
} from 'react-icons/fi';

const Mytest = () => {
  const [testSeries, setTestSeries] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [studentClass, setStudentClass] = useState('');
  
  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTestType, setSelectedTestType] = useState(''); // NEW: Test Type Filter
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        try {
          const userDoc = await firebase.firestore().collection('admissions').doc(user.uid).get();
          const userData = userDoc.exists ? userDoc.data() : {};
          const admittedClass = userData.targetClass || userData.currentClass || "";
          setStudentClass(admittedClass);

          const testSnap = await firebase.firestore().collection('testSeries').get();
          
          const tests = testSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(test => {
              if (test.status !== 'Published') return false;
              let testClasses = [];
              if (test.targetClass && Array.isArray(test.targetClass)) {
                testClasses = test.targetClass;
              } else if (typeof test.class === 'string') {
                testClasses = test.class.split(',').map(c => c.trim());
              }
              return admittedClass ? testClasses.includes(admittedClass) : false;
            });
            
          setTestSeries(tests);

          const resultsSnap = await firebase.firestore()
            .collection('testseriesresult')
            .where('userId', '==', user.uid)
            .get();
            
          const results = resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTestResults(results);

        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const getAttemptStatus = (test) => {
    const resultDoc = testResults.find(ts => ts.lectureId === test.id);
    if (!resultDoc) return null;

    let bestAttempt = resultDoc;
    let attemptCount = 1;

    if (resultDoc.attempts && resultDoc.attempts.length > 0) {
      attemptCount = resultDoc.attempts.length;
      bestAttempt = resultDoc.attempts.reduce((max, attempt) => 
        (attempt.percentage > max.percentage ? attempt : max), resultDoc.attempts[0]);
    }

    return {
      id: resultDoc.id,
      attemptCount: attemptCount,
      percentage: bestAttempt.percentage || resultDoc.percentage || 0,
      correctAnswers: bestAttempt.correctAnswers || resultDoc.correctAnswers || 0,
      totalQuestions: bestAttempt.totalQuestions || resultDoc.totalQuestions || 1,
    };
  };

  const stats = useMemo(() => {
    const total = testSeries.length;
    const attempted = testSeries.filter(t => getAttemptStatus(t)).length;
    return { total, attempted, remaining: total - attempted };
  }, [testSeries, testResults]);

  // Unique lists for dropdowns
  const uniqueSubjects = [...new Set(testSeries.map(t => t.subject))].filter(Boolean);
  const uniqueTestTypes = [...new Set(testSeries.map(t => t.testType))].filter(Boolean); // NEW: Get dynamic test types

  const filteredTests = testSeries.filter(test => {
    let testClasses = test.targetClass || (typeof test.class === 'string' ? test.class.split(',').map(c => c.trim()) : []);
    return (selectedClass === '' || testClasses.includes(selectedClass)) &&
           (selectedSubject === '' || test.subject === selectedSubject) &&
           (selectedTestType === '' || test.testType === selectedTestType); // NEW: Test Type check
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-10 font-sans">
        <StudentNav />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            {[1, 2, 3].map(i => <div key={i} className="h-16 md:h-24 bg-slate-200 rounded-xl"></div>)}
          </div>
          <div className="h-10 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-800">
      <StudentNav />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 md:pt-6">
        
        {/* Compact Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight">My Assessment Workspace</h1>
          <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">
            Modules for <span className="font-bold text-indigo-600">{studentClass}</span>
          </p>
        </div>

        {/* 3-Column Compact Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          <StatCard title="Total" value={stats.total} icon={<FiBookOpen />} bg="bg-indigo-50 text-indigo-600" />
          <StatCard title="Done" value={stats.attempted} icon={<FiCheckCircle />} bg="bg-emerald-50 text-emerald-600" />
          <StatCard title="Pending" value={stats.remaining} icon={<FiClock />} bg="bg-amber-50 text-amber-600" />
        </div>

        {/* Minimal Filters Bar */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Dropdowns Container */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Subject Filter */}
            <div className="relative w-full sm:w-36 max-w-[200px]">
              <select 
                className="appearance-none block w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700 font-bold outline-none cursor-pointer"
                onChange={(e) => setSelectedSubject(e.target.value)}
                value={selectedSubject}
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]" />
            </div>

            {/* Test Type Filter */}
            <div className="relative w-full sm:w-36 max-w-[200px]">
              <select 
                className="appearance-none block w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700 font-bold outline-none cursor-pointer"
                onChange={(e) => setSelectedTestType(e.target.value)}
                value={selectedTestType}
              >
                <option value="">All Test Types</option>
                {/* Dynamically loads DPP, Weekly, Monthly, etc. */}
                {uniqueTestTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]" />
            </div>
          </div>

          <span className="text-slate-500 text-[9px] sm:text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md border border-slate-200 whitespace-nowrap">
            {filteredTests.length} {filteredTests.length === 1 ? 'Test' : 'Tests'}
          </span>
        </div>

        {/* Compact, Scrollable Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead className="bg-slate-50 border-b border-slate-100 text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="p-3 pl-4">Test Details</th>
                  <th className="p-3">Subject & Chapter</th>
                  <th className="p-3 w-36 sm:w-48">Performance</th>
                  <th className="p-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[10px] sm:text-xs">
                {filteredTests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400 font-medium text-xs">
                      No tests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTests.map((test, index) => {
                    const result = getAttemptStatus(test);
                    const isAvailable = format(new Date(), 'yyyy-MM-dd') >= test.date;
                    const scorePercentage = result?.percentage || 0;
                    const attemptCount = result?.attemptCount || 0;
                    const needsRetake = result && scorePercentage < 90;

                    const classParam = test.targetClass && Array.isArray(test.targetClass) 
                      ? test.targetClass.join(', ') : test.class;

                    return (
                      <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* 1. Test Details */}
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-800 line-clamp-1" title={test.testName}>{index+1}. {test.testName || 'Untitled'}</span>
                            {/* NEW: Badge showing DPP/Weekly/etc. */}
                            {test.testType && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap">
                                {test.testType}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-bold text-slate-400 mt-1">
                            <span className="flex items-center gap-0.5"><FiCalendar /> {test.date}</span>
                            <span className="flex items-center gap-0.5"><FiClock /> {test.testTime}m</span>
                          </div>
                        </td>

                        {/* 2. Subject/Chapter */}
                        <td className="p-3">
                          <div className="font-bold text-slate-700 mb-0.5">{test.subject}</div>
                          <div className="text-[8px] sm:text-[9px] font-bold text-slate-500 bg-slate-100 w-max px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[120px]" title={test.chapter}>
                            {test.chapter}
                          </div>
                        </td>

                        {/* 3. Performance Status */}
                        <td className="p-3">
                          {result ? (
                            <div className="flex flex-col w-full">
                              <div className="flex justify-between items-end mb-1">
                                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                  needsRetake ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {needsRetake ? 'Review' : 'Passed'}
                                </span>
                                <span className="text-[10px] sm:text-xs font-black text-slate-700">{scorePercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 mb-1 overflow-hidden">
                                <div className={`h-1 rounded-full ${needsRetake ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${scorePercentage}%` }}></div>
                              </div>
                              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                                <span>{result.correctAnswers}/{result.totalQuestions}</span>
                                <span>{attemptCount} Att</span>
                              </div>
                            </div>
                          ) : (
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                              isAvailable ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}>
                              {isAvailable ? 'Pending' : 'Locked'}
                            </span>
                          )}
                        </td>

                        {/* 4. Actions */}
                        <td className="p-3 pr-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            {result ? (
                              <>
                                <button onClick={() => router.push(`/Student/mytestresult?id=${result.id}`)} className="px-2 py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-1">
                                  <FiBarChart2 /> <span className="hidden sm:inline">Stats</span>
                                </button>
                                {needsRetake && isAvailable && (
                                  <button onClick={() => router.push({ pathname: '/Student/MyTestseries', query: { class: classParam, subject: test.subject, chapter: test.chapter, testId: test.id }})} className="px-2 py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-1 shadow-sm">
                                    <FiRotateCcw /> Retake
                                  </button>
                                )}
                              </>
                            ) : (
                              <button onClick={() => isAvailable && router.push({ pathname: '/Student/MyTestseries', query: { class: classParam, subject: test.subject, chapter: test.chapter, testId: test.id }})} disabled={!isAvailable} className={`px-3 py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold flex items-center gap-1 transition-all ${isAvailable ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
                                {isAvailable ? <><FiPlay /> Start</> : 'Wait'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// Extremely Compact Stat Card
const StatCard = ({ title, value, bg, icon }) => (
  <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2.5 text-center sm:text-left">
    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0 ${bg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tighter sm:tracking-widest truncate mb-0.5 leading-none">{title}</p>
      <p className="text-sm sm:text-lg md:text-2xl font-black text-slate-800 leading-none">{value}</p>
    </div>
  </div>
);

export default Mytest;