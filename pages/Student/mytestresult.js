import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaChartBar, 
  FaChartLine,
  FaUser,
  FaBook,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaTrophy,
  FaMedal,
  FaExclamationTriangle,
  FaMinusCircle
} from 'react-icons/fa';
import { FiArrowLeft, FiTarget } from 'react-icons/fi';
import StudentNav from '../StudentNav';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const TestResult = () => {
  const router = useRouter();
  const { id } = router.query;
  const [testResult, setTestResult] = useState(null);
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0); 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [showRankings, setShowRankings] = useState(false);
  const [questionFilter, setQuestionFilter] = useState('all'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const db = firebase.firestore();
        const testRef = doc(db, 'testseriesresult', id);
        const testSnap = await getDoc(testRef);

        if (testSnap.exists()) {
          const resultData = testSnap.data();
          setTestResult(resultData);
          
          if (resultData.attempts && resultData.attempts.length > 0) {
            setSelectedAttemptIndex(resultData.attempts.length - 1);
          }

          const leaderboardRef = collection(db, 'testseriesresult');
          const q = query(
            leaderboardRef,
            where("class", "==", resultData.class),
            where("subject", "==", resultData.subject),
            where("chapter", "==", resultData.chapter),
          );
          
          const leaderboardSnap = await getDocs(q);
          const seriesData = leaderboardSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          const sortedSeries = seriesData.map(result => {
            let bestAttempt = result;
            if (result.attempts && result.attempts.length > 0) {
              bestAttempt = result.attempts.reduce((max, attempt) => (attempt.percentage > max.percentage ? attempt : max), result.attempts[0]);
            }

            const incorrectCount = (bestAttempt.testResults || []).filter(q => q.selectedOption !== null && !q.isCorrect).length;
            const negativeMarks = Math.floor(incorrectCount / 4); 
            const netScore = Math.max(0, (bestAttempt.correctAnswers || 0) - negativeMarks);
            const netPercentage = (netScore / (bestAttempt.totalQuestions || 1)) * 100;
            
            return {
              ...result, bestAttempt, netScore, netPercentage,
              incorrectAnswers: incorrectCount,
              totalAttempts: result.attempts?.length || 1 
            };
          }).sort((a, b) => {
            if (b.netPercentage !== a.netPercentage) return b.netPercentage - a.netPercentage; 
            return (a.bestAttempt?.timeTaken || 0) - (b.bestAttempt?.timeTaken || 0); 
          });

          setLeaderboardData(sortedSeries);
          setCurrentUserRank(sortedSeries.findIndex(item => item.id === id) + 1);
        } else {
          setError('Test result not found');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-10 font-sans">
        <StudentNav />
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 animate-pulse space-y-4">
          <div className="flex justify-between items-center"><div className="h-8 w-24 bg-slate-200 rounded-lg"></div></div>
          <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div className="h-20 bg-slate-200 rounded-xl"></div><div className="h-20 bg-slate-200 rounded-xl"></div></div>
        </div>
      </div>
    );
  }
console.log("testresult",testResult)
  if (error || !testResult) return <div className="p-10 text-center text-rose-500 font-bold">{error || "Result Unavailable"}</div>;

  const isMultiAttempt = testResult.attempts && testResult.attempts.length > 0;
  const currentAttemptData = isMultiAttempt ? testResult.attempts[selectedAttemptIndex] : testResult;

  const correctCount = currentAttemptData.correctAnswers || 0;
  const totalQuestions = currentAttemptData.totalQuestions || 1;
  const incorrectCount = (currentAttemptData.testResults || []).filter(q => q.selectedOption !== null && !q.isCorrect).length;
  const notAttempted = (currentAttemptData.testResults || []).filter(q => q.selectedOption === null).length;

  const negativeMarks = Math.floor(incorrectCount / 4);
  const netScore = Math.max(0, correctCount - negativeMarks);
  const percentage = ((netScore / totalQuestions) * 100).toFixed(1);
  const timeTakenMinutes = Math.floor((currentAttemptData.timeTaken || 0) / 60);
  const timeTakenSeconds = (currentAttemptData.timeTaken || 0) % 60;

  // --- TOPIC ANALYSIS ---
  const topicStats = {};
  currentAttemptData.testResults?.forEach(q => {
    const t = q.topic || 'General';
    if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0 };
    topicStats[t].total += 1;
    if (q.isCorrect) topicStats[t].correct += 1;
  });

  const topicAnalysis = Object.keys(topicStats).map(topic => {
    const stats = topicStats[topic];
    return { topic, accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0 };
  }).sort((a, b) => a.accuracy - b.accuracy); 

  const weakTopics = topicAnalysis.filter(t => t.accuracy < 70);
  
  // --- TREND ANALYSIS (All Attempts) ---
  const attemptScoresData = testResult.attempts?.map((att) => {
    const cCount = att.correctAnswers || 0;
    const tQ = att.totalQuestions || 1;
    const iCount = (att.testResults || []).filter(q => q.selectedOption !== null && !q.isCorrect).length;
    const nMarks = Math.floor(iCount / 4);
    const nScore = Math.max(0, cCount - nMarks);
    return Number(((nScore / tQ) * 100).toFixed(1));
  }) || [];

  const filteredQuestions = currentAttemptData.testResults?.map((q, i) => ({...q, originalIndex: i})).filter(q => {
    if (questionFilter === 'correct') return q.isCorrect;
    if (questionFilter === 'incorrect') return q.selectedOption !== null && !q.isCorrect;
    if (questionFilter === 'unattempted') return q.selectedOption === null;
    return true;
  });

  const showTrendChart = attemptScoresData.length > 1;

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-800">
      <StudentNav />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        
        {/* Nav & Controls - Compact */}
        <div className="flex justify-between items-center mb-4 gap-2">
          <button onClick={() => router.push('/Student/Mytest')} className="flex items-center text-slate-600 hover:text-indigo-600 text-xs sm:text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
            <FiArrowLeft className="mr-1" /> Back
          </button>
          {isMultiAttempt && (
            <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center text-xs">
              <span className="text-slate-400 font-bold uppercase mr-2 hidden sm:block">Attempt</span>
              <select className="bg-transparent font-bold outline-none cursor-pointer text-slate-800" value={selectedAttemptIndex} onChange={(e) => setSelectedAttemptIndex(Number(e.target.value))}>
                {testResult.attempts.map((_, i) => <option key={i} value={i}>#{i + 1} {i === testResult.attempts.length - 1 ? '(Last)' : ''}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Hero Section - Compact Box */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl p-4 sm:p-5 shadow-md mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="min-w-0 flex-1">
            <span className="inline-block bg-white/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
              {testResult.class} • {testResult.subject}
            </span>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight truncate">{testResult.lectureTitle}</h1>
            <p className="text-indigo-300 text-xs mt-1 flex items-center gap-1.5"><FaUser size={10} /> {testResult.userName}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="bg-white/10 rounded-lg p-3 flex-1 md:w-28 text-center border border-white/10">
              <p className="text-indigo-200 text-[9px] uppercase font-bold mb-0.5">Score</p>
              <p className="text-xl sm:text-2xl font-black text-white">{netScore}<span className="text-sm text-indigo-300">/{totalQuestions}</span></p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 flex-1 md:w-28 text-center border border-white/10">
              <p className="text-indigo-200 text-[9px] uppercase font-bold mb-0.5">Rank</p>
              <p className="text-xl sm:text-2xl font-black text-white">#{currentUserRank || '-'}</p>
            </div>
          </div>
        </div>

        {/* 4-Grid Stats - 2x2 on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase flex justify-center items-center gap-1 mb-1"><FiTarget /> Accuracy</p>
            <p className={`text-xl sm:text-2xl font-black ${percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>{percentage}%</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 flex flex-col justify-center items-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1 mb-1"><FaClock size={10}/> Time</p>
            <p className="text-lg sm:text-xl font-black text-slate-800">{timeTakenMinutes}m {timeTakenSeconds}s</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 flex items-center justify-center gap-2">
            <div className="w-1.5 h-8 bg-emerald-400 rounded-full"></div>
            <div><p className="text-slate-400 text-[10px] font-bold uppercase leading-none">Correct</p><p className="text-xl sm:text-2xl font-black leading-none">{correctCount}</p></div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 flex items-center justify-center gap-2">
            <div className="w-1.5 h-8 bg-rose-400 rounded-full"></div>
            <div><p className="text-slate-400 text-[10px] font-bold uppercase leading-none">Wrong</p><p className="text-xl sm:text-2xl font-black leading-none">{incorrectCount}</p></div>
          </div>
        </div>

        {/* Charts & Leaderboard Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4`}>
          
          {/* Topic Analysis Bar Chart */}
          <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-64 flex flex-col ${showTrendChart ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <h2 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5"><FaChartBar className="text-indigo-500"/> Topic Analysis</h2>
            <div className="flex-1 relative">
              <Bar
                data={{
                  labels: topicAnalysis.map(t => t.topic.substring(0, 8) + '..'),
                  datasets: [{ data: topicAnalysis.map(t => t.accuracy), backgroundColor: topicAnalysis.map(t => t.accuracy >= 70 ? '#10B981' : t.accuracy >= 40 ? '#F59E0B' : '#F43F5E'), borderRadius: 4 }]
                }}
                options={{ responsive: true, maintainAspectRatio: false, scales: { y: { max: 100, display: false }, x: { grid: { display: false }, ticks: { font: { size: 9 } } } }, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          {/* Performance Trend Line Chart (Only shows if >1 attempts) */}
          {showTrendChart && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-64 flex flex-col lg:col-span-1">
              <h2 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5"><FaChartLine className="text-indigo-500"/> Attempt Trend</h2>
              <div className="flex-1 relative">
                <Line
                  data={{
                    labels: attemptScoresData.map((_, i) => `#${i + 1}`),
                    datasets: [{
                      label: 'Score %',
                      data: attemptScoresData,
                      borderColor: '#6366F1',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      borderWidth: 2,
                      tension: 0.3,
                      pointBackgroundColor: '#6366F1',
                      pointRadius: 4,
                      fill: true,
                    }]
                  }}
                  options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100, ticks: { font: { size: 9 } } }, x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } } }, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
          )}

          {/* Mini Split & Review Component */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
              <div className="w-24 h-24 relative flex-shrink-0">
                <Doughnut data={{ labels: ['C', 'W', 'S'], datasets: [{ data: [correctCount, incorrectCount, notAttempted], backgroundColor: ['#10B981', '#F43F5E', '#94A3B8'], borderWidth: 0 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
              </div>
              <div className="text-right">
                <button onClick={() => setShowRankings(!showRankings)} className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                  <FaTrophy className="text-amber-500" /> {showRankings ? 'Hide Rank' : 'View Leaders'}
                </button>
              </div>
            </div>
            
            {weakTopics.length > 0 && (
              <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 flex-1">
                <p className="text-[10px] font-bold text-rose-800 uppercase mb-2 flex items-center gap-1"><FaExclamationTriangle /> Review Topics</p>
                <div className="space-y-1.5">
                  {weakTopics.slice(0, 2).map((t, i) => (
                    <div key={i} className="bg-white rounded-md p-1.5 text-xs flex justify-between shadow-sm">
                      <span className="font-semibold text-slate-700 truncate">{t.topic}</span><span className="text-rose-600 font-bold ml-2">{t.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Leaderboard Table */}
        {showRankings && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4 overflow-x-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead className="bg-slate-50 text-[9px] uppercase text-slate-400">
                <tr><th className="p-2 text-center w-12">#</th><th className="p-2">Name</th><th className="p-2 text-center">Score</th><th className="p-2 text-center">%</th></tr>
              </thead>
              <tbody className="text-xs font-medium divide-y divide-slate-100">
                {leaderboardData.map((res, i) => (
                  <tr key={res.id} className={res.id === id ? 'bg-indigo-50/50' : ''}>
                    <td className="p-2 text-center font-bold">{i < 3 ? <FaMedal className={`mx-auto ${i===0?'text-amber-400':i===1?'text-slate-300':'text-amber-600'}`}/> : i+1}</td>
                    <td className="p-2 font-bold text-slate-800 flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white ${res.id === id ? 'bg-indigo-500' : 'bg-slate-300'}`}>{res.userName.charAt(0)}</div>
                      <span className="truncate max-w-[100px] sm:max-w-xs">{res.userName}</span>
                    </td>
                    <td className="p-2 text-center font-black">{res.netScore}</td>
                    <td className="p-2 text-center"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${res.netPercentage>=70?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700'}`}>{res.netPercentage.toFixed(0)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Review Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50">
            <h2 className="text-sm sm:text-base font-extrabold flex items-center gap-1.5"><FaBook className="text-indigo-500"/> Solution Review</h2>
            
            {/* Small Tab Style Filters */}
            <div className="flex bg-slate-200/50 p-1 rounded-lg w-full sm:w-auto">
              {[{id:'all',l:'All'},{id:'correct',l:'Right'},{id:'incorrect',l:'Wrong'},{id:'unattempted',l:'Skip'}].map(f => (
                <button key={f.id} onClick={() => setQuestionFilter(f.id)} className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase rounded-md transition-all ${questionFilter===f.id?'bg-white text-slate-900 shadow-sm':'text-slate-500'}`}>{f.l}</button>
              ))}
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {filteredQuestions?.map((q) => (
              <div key={q.originalIndex} className="p-3 sm:p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex gap-2.5 sm:gap-4 cursor-pointer" onClick={() => setExpandedQuestion(expandedQuestion === q.originalIndex ? null : q.originalIndex)}>
                  <div className="mt-0.5">
                    {q.isCorrect ? <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><FaCheck size={10} /></div> : 
                     q.selectedOption === null ? <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><FaMinusCircle size={10} /></div> : 
                     <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><FaTimes size={10} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-slate-400">Q{q.originalIndex + 1}</span>
                      <span className="text-[8px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 truncate">{q.topic || 'General'}</span>
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-800 line-clamp-2">{q.question}</h3>
                  </div>
                  <div className="text-slate-400">{expandedQuestion === q.originalIndex ? <FaEyeSlash size={14} /> : <FaEye size={14} />}</div>
                </div>
                
                {/* Compact Expanded Options */}
             {/* Compact Expanded Options */}
             {expandedQuestion === q.originalIndex && (
                  <div className="mt-3 ml-7 sm:ml-9 pb-1">
                    {q.questionImage && <img src={q.questionImage} alt="Visual" className="max-h-32 rounded-lg mb-3 border border-slate-200" />}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, i) => {
                        const isCorrectOpt = i === q.correctOption;
                        const isSelectedOpt = i === q.selectedOption;
                        let bg = "border-slate-200 bg-white text-slate-600";
                        if(isCorrectOpt) bg = "border-emerald-300 bg-emerald-50 text-emerald-900";
                        else if(isSelectedOpt) bg = "border-rose-300 bg-rose-50 text-rose-900";
                        
                        return (
                          <div key={i} className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-medium ${bg}`}>
                            <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-white/50 border border-black/5">{String.fromCharCode(65+i)}</span>
                            <span className="flex-1 leading-tight">{opt}</span>
                            {isCorrectOpt && <FaCheckCircle className="text-emerald-500" />}
                            {isSelectedOpt && !isCorrectOpt && <FaTimesCircle className="text-rose-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* NEW: Description / Explanation Box */}
                    {q.description && (
                      <div className="mt-3 p-3 bg-slate-100/70 border border-slate-200 rounded-lg">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <FaBook className="text-indigo-400" /> Explanation
                        </p>
                        <div 
                          className="text-[11px] sm:text-xs text-slate-700 leading-relaxed [&>p]:mb-1 [&>p:last-child]:mb-0" 
                          dangerouslySetInnerHTML={{ __html: q.description }} 
                        />
                      </div>
                    )}
                    
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestResult;