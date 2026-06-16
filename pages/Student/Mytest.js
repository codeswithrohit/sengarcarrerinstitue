import React, { useEffect, useState, useMemo } from 'react';
import StudentNav from '../StudentNav';
import { firebase } from '../../Firebase/config';
import { useRouter } from 'next/router';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiRotateCcw,
  FiBarChart2,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const Mytest = () => {
  const [testSeries, setTestSeries] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [studentClass, setStudentClass] = useState('');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const router = useRouter();

  // ================================
  // Helpers
  // ================================

  const normalizeTime = (time) => {
    if (!time) return '00:00';

    const cleanTime = String(time).trim();

    // Already in HH:mm format
    if (/^\d{2}:\d{2}$/.test(cleanTime)) {
      return cleanTime;
    }

    // If HH:mm:ss then convert to HH:mm
    if (/^\d{2}:\d{2}:\d{2}$/.test(cleanTime)) {
      return cleanTime.slice(0, 5);
    }

    return '00:00';
  };

  const getTestStartDateTime = (test) => {
    if (!test?.date) return null;

    const time = normalizeTime(test.testStartTime);
    const dateTimeString = `${test.date}T${time}:00`;

    const startDateTime = new Date(dateTimeString);

    if (Number.isNaN(startDateTime.getTime())) {
      return null;
    }

    return startDateTime;
  };

  const getAvailabilityInfo = (test) => {
    const now = new Date();
    const startDateTime = getTestStartDateTime(test);

    if (!startDateTime) {
      return {
        isAvailable: false,
        statusText: 'Invalid Date',
        message: 'Test date/time not valid',
        startDateTime: null
      };
    }

    const isAvailable = now >= startDateTime;

    return {
      isAvailable,
      statusText: isAvailable ? 'Available' : 'Locked',
      message: isAvailable
        ? 'Test is available now'
        : `Starts on ${formatDisplayDate(test.date)} at ${formatDisplayTime(test.testStartTime)}`,
      startDateTime
    };
  };

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return 'N/A';

    const dateObj = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(dateObj.getTime())) {
      return dateValue;
    }

    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDisplayTime = (timeValue) => {
    if (!timeValue) return '00:00';

    const time = normalizeTime(timeValue);
    const timeObj = new Date(`2000-01-01T${time}:00`);

    if (Number.isNaN(timeObj.getTime())) {
      return timeValue;
    }

    return timeObj.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const sortTestsByDateTime = (tests) => {
    return [...tests].sort((a, b) => {
      const aDate = getTestStartDateTime(a);
      const bDate = getTestStartDateTime(b);

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;

      return bDate.getTime() - aDate.getTime();
    });
  };

  // ================================
  // Fetch data
  // ================================

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        try {
          setLoading(true);

          const userDoc = await firebase
            .firestore()
            .collection('sengarcarreradmissions')
            .doc(user.uid)
            .get();

          const userData = userDoc.exists ? userDoc.data() : {};
          const admittedClass = userData.targetClass || userData.currentClass || '';

          setStudentClass(admittedClass);

          const testSnap = await firebase
            .firestore()
            .collection('sengarcarrertestSeries')
            .get();

          const tests = testSnap.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter((test) => {
              if (test.status !== 'Published') return false;

              let testClasses = [];

              if (test.targetClass && Array.isArray(test.targetClass)) {
                testClasses = test.targetClass;
              } else if (typeof test.class === 'string') {
                testClasses = test.class.split(',').map((c) => c.trim());
              }

              return admittedClass ? testClasses.includes(admittedClass) : false;
            });

          setTestSeries(sortTestsByDateTime(tests));

          const resultsSnap = await firebase
            .firestore()
            .collection('sengarcarrertestseriesresult')
            .where('userId', '==', user.uid)
            .get();

          const results = resultsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setTestResults(results);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ================================
  // Attempt status Mapped to testId
  // ================================

  const getAttemptStatus = (test) => {
    const resultDoc = testResults.find((ts) => ts.testId === test.id || ts.lectureId === test.id);

    if (!resultDoc) return null;

    let bestAttempt = resultDoc;
    let attemptCount = 1;

    if (resultDoc.attempts && resultDoc.attempts.length > 0) {
      attemptCount = resultDoc.attempts.length;

      bestAttempt = resultDoc.attempts.reduce(
        (max, attempt) =>
          (attempt.percentage || 0) > (max.percentage || 0) ? attempt : max,
        resultDoc.attempts[0]
      );
    }

    return {
      id: resultDoc.id,
      attemptCount,
      percentage: bestAttempt.percentage ?? resultDoc.bestPercentage ?? resultDoc.percentage ?? 0,
      correctAnswers: bestAttempt.correctAnswers ?? resultDoc.bestCorrectAnswers ?? resultDoc.correctAnswers ?? 0,
      totalQuestions: (bestAttempt.totalQuestions ?? resultDoc.totalQuestions) || 1
    };
  };

  // ================================
  // Stats
  // ================================

  const stats = useMemo(() => {
    const total = testSeries.length;
    const attempted = testSeries.filter((t) => getAttemptStatus(t)).length;

    return {
      total,
      attempted,
      remaining: total - attempted
    };
  }, [testSeries, testResults]);

  // ================================
  // Filters
  // ================================

  const uniqueSubjects = [...new Set(testSeries.map((t) => t.subject))].filter(Boolean);
  const uniqueTestTypes = [...new Set(testSeries.map((t) => t.testType))].filter(Boolean);

  const filteredTests = useMemo(() => {
    return testSeries.filter((test) => {
      return (
        (selectedSubject === '' || test.subject === selectedSubject) &&
        (selectedTestType === '' || test.testType === selectedTestType)
      );
    });
  }, [testSeries, selectedSubject, selectedTestType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, selectedTestType, itemsPerPage]);

  // ================================
  // Pagination
  // ================================

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem =
    filteredTests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, filteredTests.length);

  // ================================
  // Loading UI
  // ================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-10 font-sans">
        <StudentNav />

        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 md:h-24 bg-slate-200 rounded-xl"></div>
            ))}
          </div>

          <div className="h-10 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  // ================================
  // Main UI
  // ================================

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-800">
      <StudentNav />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 md:pt-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight">
            My Assessment Workspace
          </h1>

          <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">
            Modules for{' '}
            <span className="font-bold text-indigo-600">
              {studentClass || 'N/A'}
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<FiBookOpen />}
            bg="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Done"
            value={stats.attempted}
            icon={<FiCheckCircle />}
            bg="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Pending"
            value={stats.remaining}
            icon={<FiClock />}
            bg="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Subject Filter */}
            <div className="relative w-full sm:w-36 max-w-[200px]">
              <select
                className="appearance-none block w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700 font-bold outline-none cursor-pointer"
                onChange={(e) => setSelectedSubject(e.target.value)}
                value={selectedSubject}
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
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
                {uniqueTestTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]" />
            </div>

            {(selectedSubject || selectedTestType) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSubject('');
                  setSelectedTestType('');
                }}
                className="text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1.5 hover:bg-rose-100"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-1 text-[9px] sm:text-[10px] font-bold outline-none"
            >
              <option value={5}>5 / page</option>
              <option value={8}>8 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>

            <span className="text-slate-500 text-[9px] sm:text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md border border-slate-200 whitespace-nowrap">
              {filteredTests.length} {filteredTests.length === 1 ? 'Test' : 'Tests'}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead className="bg-slate-50 border-b border-slate-100 text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="p-3 pl-4">Test Details</th>
                  <th className="p-3">Subject & Chapter</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3 w-36 sm:w-48">Performance</th>
                  <th className="p-3 pr-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-[10px] sm:text-xs">
                {paginatedTests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-slate-400 font-medium text-xs"
                    >
                      No tests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedTests.map((test, index) => {
                    const result = getAttemptStatus(test);
                    const availability = getAvailabilityInfo(test);
                    const isAvailable = availability.isAvailable;

                    const scorePercentage = result?.percentage || 0;
                    const attemptCount = result?.attemptCount || 0;

                    // MODIFIED: Retake logic handles specific evaluation requirements
                    const isProgressTest = test.testType === 'Progress Test';
                    const passedTest = scorePercentage >= 40;
                    const needsRetake = result && !passedTest;

                    const classParam =
                      test.targetClass && Array.isArray(test.targetClass)
                        ? test.targetClass.join(', ')
                        : test.class;

                    const queryParams = {
                      class: classParam,
                      subject: test.subject,
                      chapter: test.chapter,
                      testId: test.id,
                      testType: test.testType || ''
                    };

                    const serialNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <tr
                        key={test.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Test Details */}
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="font-bold text-slate-800 line-clamp-1"
                              title={test.testName}
                            >
                              {serialNumber}. {test.testName || 'Untitled'}
                            </span>

                            {test.testType && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[8px] font-black border whitespace-nowrap ${
                                  isProgressTest
                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                }`}
                              >
                                {test.testType}
                              </span>
                            )}
                          </div>

                          <div
                            className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-1 line-clamp-1"
                            title={classParam}
                          >
                            {classParam || studentClass || 'N/A'}
                          </div>
                        </td>

                        {/* Subject / Chapter */}
                        <td className="p-3">
                          <div className="font-bold text-slate-700 mb-0.5">
                            {test.subject || 'N/A'}
                          </div>

                          <div
                            className="text-[8px] sm:text-[9px] font-bold text-slate-500 bg-slate-100 w-max px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[150px]"
                            title={test.chapter}
                          >
                            {test.chapter || 'N/A'}
                          </div>
                        </td>

                        {/* Date and Time */}
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-slate-600">
                              <FiCalendar className="text-indigo-500" />
                              {formatDisplayDate(test.date)}
                            </span>

                            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-slate-600">
                              <FiClock className="text-emerald-500" />
                              Start: {formatDisplayTime(test.testStartTime)}
                            </span>

                            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">
                              Duration: {test.testTime || 0} min
                            </span>

                            {!isAvailable && (
                              <span className="text-[8px] font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 w-max">
                                Not started yet
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Performance Column */}
                        <td className="p-3">
                          {result ? (
                            <div 
                              className="flex flex-col w-full cursor-pointer hover:opacity-80 group"
                              onClick={() => router.push(`/Student/mytestresult?id=${result.id}`)}
                              title="Click to view detailed results"
                            >
                              <div className="flex justify-between items-end mb-1">
                                <span
                                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    needsRetake
                                      ? 'bg-rose-50 text-rose-700'
                                      : 'bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  {needsRetake ? 'Review' : 'Passed'}
                                </span>

                                <span className="text-[10px] sm:text-xs font-black text-slate-700 group-hover:text-indigo-600 transition-colors">
                                  {scorePercentage}%
                                </span>
                              </div>

                              <div className="w-full bg-slate-100 rounded-full h-1 mb-1 overflow-hidden">
                                <div
                                  className={`h-1 rounded-full ${
                                    needsRetake ? 'bg-rose-500' : 'bg-emerald-500'
                                  }`}
                                  style={{
                                    width: `${scorePercentage}%`
                                  }}
                                ></div>
                              </div>

                              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                                <span>
                                  {result.correctAnswers}/{result.totalQuestions} Qs
                                </span>
                                <span className="text-indigo-500 underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                                <span>{attemptCount} Att</span>
                              </div>
                            </div>
                          ) : (
                            <span
                              className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                                isAvailable
                                  ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                            >
                              {isAvailable ? 'Pending' : 'Locked'}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3 pr-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            {result ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    router.push(`/Student/mytestresult?id=${result.id}`)
                                  }
                                  className="px-2 py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-1"
                                >
                                  <FiBarChart2 />
                                  <span className="hidden sm:inline">Stats</span>
                                </button>

                                {/* MODIFIED: Only render Retake if this is a Progress Test */}
                                {isProgressTest && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!isAvailable) return;

                                      router.push({
                                        pathname: '/Student/MyTestseries',
                                        query: queryParams
                                      });
                                    }}
                                    disabled={!isAvailable}
                                    title={!isAvailable ? availability.message : 'Retake test'}
                                    className={`px-2 py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold transition-colors flex items-center gap-1 shadow-sm ${
                                      isAvailable
                                        ? 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100'
                                        : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                  >
                                    <FiRotateCcw />
                                    {isAvailable ? 'Retake' : 'Wait'}
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!isAvailable) return;

                                  router.push({
                                    pathname: '/Student/MyTestseries',
                                    query: queryParams
                                  });
                                }}
                                disabled={!isAvailable}
                                title={!!isAvailable ? availability.message : 'Start test'}
                                className={`px-3 py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  isAvailable
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                }`}
                              >
                                {isAvailable ? (
                                  <>
                                    <FiPlay />
                                    Start
                                  </>
                                ) : (
                                  'Wait'
                                )}
                              </button>
                            )}
                          </div>

                          {!isAvailable && (
                            <p className="mt-1 text-[8px] font-black text-slate-400">
                              {availability.message}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-3 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-[10px] sm:text-xs text-slate-500 font-bold">
              Showing{' '}
              <span className="text-slate-800">{startItem}</span>
              {' '}to{' '}
              <span className="text-slate-800">{endItem}</span>
              {' '}of{' '}
              <span className="text-slate-800">{filteredTests.length}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <FiChevronLeft />
              </button>

              <span className="text-[10px] sm:text-xs font-black text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, bg, icon }) => (
  <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2.5 text-center sm:text-left">
    <div
      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0 ${bg}`}
    >
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tighter sm:tracking-widest truncate mb-0.5 leading-none">
        {title}
      </p>

      <p className="text-sm sm:text-lg md:text-2xl font-black text-slate-800 leading-none">
        {value}
      </p>
    </div>
  </div>
);

export default Mytest;