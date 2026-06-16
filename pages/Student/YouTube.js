import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FiChevronDown, FiChevronUp, FiPlayCircle, FiCheckCircle, FiClock, FiLock, FiBarChart2, FiRotateCcw } from 'react-icons/fi';
import { FaYoutube, FaBookOpen } from 'react-icons/fa';
import StudentNav from '../StudentNav';

// --- UTILITY: Convert MM:SS to total seconds ---
const parseDuration = (timeStr) => {
    if (!timeStr) return 1; 
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return parseInt(timeStr) || 1;
};

// --- UTILITY: Safe String Comparison ---
const safeStr = (str) => (str || '').toString().trim().toLowerCase();

// --- SUB-COMPONENT: Individual Topic Card with Watch Tracking, Resume & Retake Logic ---
const TopicCard = ({ topic, topicIndex, chapter, activeClass, activeSubject, currentUserId, testseries, extractVideoId }) => {
    const router = useRouter();
    const videoId = extractVideoId(topic.url);
    const durationSeconds = parseDuration(topic.duration);
    
    const [progressPct, setProgressPct] = useState(0);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [hasFetchedProgress, setHasFetchedProgress] = useState(false);

    const localSecondsRef = useRef(0);
    const playheadRef = useRef(0);

    // 1. BULLETPROOF MATCHING LOGIC (Ignores spaces and case sensitivity)
    const matchingTest = testseries.find(test => {
        const targetTopic = safeStr(topic.id); // Using the ID based on your previous debugging
        const isMatch = (
            safeStr(test.lectureId) === targetTopic || 
            safeStr(test.lectureTitle) === targetTopic || 
            safeStr(test.testName) === targetTopic
        );
        return isMatch;
    });

    const testTaken = !!matchingTest;
    let scorePercentage = 0;

    if (matchingTest) {
        let bestAttempt = matchingTest;
        if (matchingTest.attempts && matchingTest.attempts.length > 0) {
            bestAttempt = matchingTest.attempts.reduce((max, attempt) => 
                (Number(attempt.percentage || 0) > Number(max.percentage || 0) ? attempt : max), matchingTest.attempts[0]);
        }
        scorePercentage = bestAttempt.percentage !== undefined ? Number(bestAttempt.percentage) : 0;
    }

    const needsRetake = testTaken && scorePercentage < 80;

    // 2. Fetch existing progress
    useEffect(() => {
        if (!currentUserId || !videoId) return;
        const fetchProgress = async () => {
            try {
                const db = firebase.firestore();
                const ref = doc(db, 'sengarcarrervideoProgress', `${currentUserId}_${videoId}`);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    localSecondsRef.current = data.watchedSeconds || 0;
                    playheadRef.current = data.lastPlayhead || 0;
                    setWatchedSeconds(localSecondsRef.current);
                    setProgressPct(data.percentage || 0);
                    setIsUnlocked(data.percentage >= 90);
                }
            } catch (error) {
                console.error("Error fetching progress:", error);
            } finally {
                setHasFetchedProgress(true); 
            }
        };
        fetchProgress();
    }, [currentUserId, videoId]);

    // 3. Save progress
    const saveProgressToDB = async (seconds, pct, playhead) => {
        if (!currentUserId || !videoId) return;
        try {
            const db = firebase.firestore();
            const ref = doc(db, 'sengarcarrervideoProgress', `${currentUserId}_${videoId}`);
            await setDoc(ref, {
                userId: currentUserId,
                videoId,
                topicName: topic.name,
                watchedSeconds: seconds,
                percentage: pct,
                lastPlayhead: playhead, 
                unlocked: pct >= 90,
                lastUpdated: serverTimestamp()
            }, { merge: true });
        } catch (e) { console.error("Error saving progress:", e); }
    };

    // 4. Initialize YouTube API
    useEffect(() => {
        if (!hasFetchedProgress || !videoId) return;
        let player;
        let timer;
        const initPlayer = () => {
            player = new window.YT.Player(`yt-player-${videoId}`, {
                videoId: videoId,
                playerVars: { enablejsapi: 1, rel: 0, start: Math.floor(playheadRef.current) },
                events: {
                    onReady: (event) => { if (playheadRef.current > 0) event.target.seekTo(playheadRef.current, true); },
                    onStateChange: (event) => {
                        if (event.data === 1) { // PLAYING
                            timer = setInterval(() => {
                                localSecondsRef.current += 1; 
                                playheadRef.current = player.getCurrentTime ? player.getCurrentTime() : 0; 
                                const pct = Math.min((localSecondsRef.current / durationSeconds) * 100, 100);
                                setWatchedSeconds(localSecondsRef.current);
                                setProgressPct(pct);
                                if (pct >= 90 && !isUnlocked) {
                                    setIsUnlocked(true);
                                    saveProgressToDB(localSecondsRef.current, pct, playheadRef.current);
                                }
                                if (localSecondsRef.current % 10 === 0) saveProgressToDB(localSecondsRef.current, pct, playheadRef.current);
                            }, 1000);
                        } else {
                            clearInterval(timer);
                            if (player && player.getCurrentTime) {
                                const currentPct = Math.min((localSecondsRef.current / durationSeconds) * 100, 100);
                                saveProgressToDB(localSecondsRef.current, currentPct, player.getCurrentTime());
                            }
                        }
                    }
                }
            });
        };
        const checkYT = setInterval(() => {
            if (window.YT && window.YT.Player) {
                clearInterval(checkYT);
                if (!document.getElementById(`yt-player-${videoId}`).hasChildNodes()) initPlayer();
            }
        }, 500);
        return () => { clearInterval(timer); clearInterval(checkYT); if (player && player.destroy) player.destroy(); };
    }, [hasFetchedProgress, videoId, durationSeconds]);

    return (
        <div className="bg-white rounded-xl p-2 sm:p-3 border border-slate-200 shadow-sm flex flex-col h-full hover:border-indigo-300 hover:shadow transition-all group">
            
            {/* Embedded YouTube Player */}
            <div className="mb-3 rounded-lg overflow-hidden bg-black aspect-video relative shadow-inner">
                <div id={`yt-player-${videoId}`} className="w-full h-full"></div>
            </div>

            {/* Smart Micro Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden flex-shrink-0">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progressPct}%` }}></div>
            </div>

            {/* Content Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3 min-w-0">
                    {/* Added Index + 1 for sequence tracking */}
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {topicIndex + 1}. {topic.name}
                    </h4>
                    
                    <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            <FiClock className="mr-1 text-slate-400" /> {topic.duration}
                        </div>
                        
                        {/* Dynamic Display: Score if test taken, else Watched % */}
                        {testTaken ? (
                            <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded ${needsRetake ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {scorePercentage.toFixed(0)}% Score
                            </span>
                        ) : (
                            <span className={`text-[9px] sm:text-[10px] font-black uppercase ${isUnlocked ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {Math.floor(progressPct)}% Watched
                            </span>
                        )}
                    </div>
                </div>

                {/* Professional Action Buttons */}
                <div className="mt-auto">
                    {testTaken ? (
                        <div className="flex gap-2">
                            <button onClick={() => router.push(`/Student/testresult?id=${matchingTest.id}`)} className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all border ${needsRetake ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm'}`}>
                                {needsRetake ? <><FiBarChart2 /> Result</> : <><FiCheckCircle /> Passed: Result</>}
                            </button>
                            {needsRetake && (
                                <button onClick={() => router.push({ pathname: '/Student/TestSeries', query: { class: activeClass, subject: activeSubject, chapter: chapter.chapter, topic: topic.name, lectureId: chapter.id }})} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[10px] sm:text-xs font-bold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shadow-sm">
                                    <FiRotateCcw /> Retake
                                </button>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => router.push({ pathname: '/Student/TestSeries', query: { class: activeClass, subject: activeSubject, chapter: chapter.chapter, topic: topic.name, lectureId: chapter.id }})} disabled={!isUnlocked} className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${isUnlocked ? 'bg-indigo-600 text-white shadow hover:bg-indigo-700 hover:shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
                            {isUnlocked ? <><FiPlayCircle className="text-sm" /> Take Test</> : <><FiLock /> Watch 90% to Unlock</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const HomeYoutube = () => {
    const [lecture, setLecture] = useState([]);
    const [testseries, setTestseries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeClass, setActiveClass] = useState('');
    const [activeSubject, setActiveSubject] = useState('');
    const [expandedChapters, setExpandedChapters] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
        const authListener = firebase.auth().onAuthStateChanged(user => setCurrentUserId(user ? user.uid : null));
        return () => authListener();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                // Fetch Lectures
                const lSnap = await getDocs(collection(db, 'sengarcarrerlectures'));
                const lData = lSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setLecture(lData);
                if (lData.length > 0) {
                    setActiveClass(lData[0].class);
                    const sub = lData.find(i => i.class === lData[0].class)?.subject;
                    if(sub) setActiveSubject(sub);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!currentUserId) return;
        const fetchResults = async () => {
            const db = firebase.firestore();
            const qSnap = await getDocs(collection(db, 'sengarcarreryttestseriesresult'));
            const results = qSnap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(res => res.userId === currentUserId);
            
            setTestseries(results);
        };
        fetchResults();
    }, [currentUserId]);

    const extractVideoId = (url) => {
        const match = (url || '').match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const toggleChapter = (id) => setExpandedChapters(p => ({ ...p, [id]: !p[id] }));

    const classes = [...new Set(lecture.map(i => i.class))].sort();
    const subjects = [...new Set(lecture.filter(i => i.class === activeClass).map(i => i.subject))].sort();
    const chapters = lecture.filter(i => i.class === activeClass && i.subject === activeSubject).sort((a,b) => a.chapter.localeCompare(b.chapter));

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 pb-10 font-sans">
                <StudentNav />
                <div className="max-w-7xl mx-auto px-3 py-6 animate-pulse space-y-4">
                    <div className="h-6 w-48 bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-14 w-full bg-slate-200 rounded-xl"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
            <StudentNav />
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 md:pt-6">
                
                {/* Premium Dashboard Header */}
                <div className="flex items-center justify-between mb-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-rose-100">
                            <FaYoutube className="text-xl sm:text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight">Learning Portal</h1>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">Complete 90% of the video to unlock assessments</p>
                        </div>
                    </div>
                </div>
                
                {/* Interactive Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                    <div className="relative flex-1">
                        <label className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black tracking-widest text-indigo-500 uppercase">Class</label>
                        <select value={activeClass} onChange={(e) => { setActiveClass(e.target.value); const newSubs = [...new Set(lecture.filter(item => item.class === e.target.value).map(item => item.subject))].sort(); setActiveSubject(newSubs.length > 0 ? newSubs[0] : ''); }} className="w-full appearance-none bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer">
                            <option value="" disabled>Select Class</option>
                            {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg" />
                    </div>

                    <div className="relative flex-1">
                        <label className="absolute -top-2 left-3 bg-white px-1.5 text-[9px] font-black tracking-widest text-indigo-500 uppercase">Subject</label>
                        <select value={activeSubject} onChange={(e) => setActiveSubject(e.target.value)} disabled={!activeClass || subjects.length === 0} className="w-full appearance-none bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="" disabled>Select Subject</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg" />
                    </div>
                </div>

                {/* Chapter Accordions */}
                <div className="space-y-3">
                    {chapters.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 shadow-sm">
                            <FaBookOpen className="text-4xl text-slate-200 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-500">Select a class and subject to view learning materials.</p>
                        </div>
                    ) : (
                        chapters.map((chapter, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200">
                                <div className="p-4 sm:p-5 cursor-pointer bg-slate-50/80 hover:bg-slate-50 flex justify-between items-center group" onClick={() => toggleChapter(chapter.id)}>
                                    <div className="flex items-center gap-3 pr-4">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <FaBookOpen className="text-sm" />
                                        </div>
                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">{chapter.chapter}</h3>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 hidden sm:block">
                                            {chapter.topics?.length || 0} Topics
                                        </span>
                                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500 transition-colors">
                                            {expandedChapters[chapter.id] ? <FiChevronUp /> : <FiChevronDown />}
                                        </div>
                                    </div>
                                </div>
                                
                                {expandedChapters[chapter.id] && (
                                    <div className="p-3 sm:p-5 border-t border-slate-100 bg-white">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                            {chapter.topics?.map((topic, ti) => (
                                                <TopicCard 
                                                    key={ti} 
                                                    topic={topic} 
                                                    topicIndex={ti} 
                                                    chapter={chapter} 
                                                    activeClass={activeClass} 
                                                    activeSubject={activeSubject} 
                                                    currentUserId={currentUserId} 
                                                    testseries={testseries} 
                                                    extractVideoId={extractVideoId} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomeYoutube;