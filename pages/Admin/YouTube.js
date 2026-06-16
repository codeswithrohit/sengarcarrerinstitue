import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from '@/components/AdminNav';
import { FiChevronDown, FiChevronUp, FiPlus, FiEdit2, FiTrash2, FiVideo, FiBarChart2, FiX,FiClock,FiCheckCircle,FiLock } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
const YouTube = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState({});
  const [expandedTopics1, setExpandedTopics1] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Progress Report State
  const [selectedTopicReport, setSelectedTopicReport] = useState(null);
  const [topicProgressData, setTopicProgressData] = useState([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    chapter: '',
    topics: [{ name: '', url: '', duration: '' }]
  });

  // Extract Video ID Helper
  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fetch lectures from Firestore
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const db = firebase.firestore();
        const lecturesRef = db.collection('sengarcarrerlectures');
        const snapshot = await lecturesRef.get();
        const lecturesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLectures(lecturesData);
      } catch (error) {
        toast.error('Failed to fetch lectures');
        console.error('Error fetching lectures:', error);
      }
    };
    fetchLectures();
  }, []);

  // Fetch Report Data
  const handleViewReport = async (topic) => {
    const videoId = extractVideoId(topic.url);
    if (!videoId) {
      toast.error('Invalid YouTube URL in this topic.');
      return;
    }

    setSelectedTopicReport(topic.name);
    setShowReportPopup(true);
    setIsLoadingReport(true);
    setTopicProgressData([]);

    try {
      const db = firebase.firestore();
      // 1. Fetch progress logs for this specific video
      const progressSnap = await db.collection('sengarcarrervideoProgress')
        .where('videoId', '==', videoId)
        .get();

      const logs = progressSnap.docs.map(doc => doc.data());

      // 2. Fetch User Details for those logs
      const enrichedLogs = await Promise.all(logs.map(async (log) => {
        try {
          const userDoc = await db.collection('admissions').doc(log.userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            return {
              ...log,
              studentName: userData.name || 'Unknown',
              studentId: userData.studentid || 'N/A',
              mobile: userData.mobileNumber || 'N/A',
              className: userData.admissionFor || 'N/A'
            };
          }
          return { ...log, studentName: 'Unknown', studentId: 'N/A', mobile: 'N/A', className: 'N/A' };
        } catch (e) {
          return { ...log, studentName: 'Error', studentId: 'N/A', mobile: 'N/A', className: 'N/A' };
        }
      }));

      // Sort by percentage descending
      enrichedLogs.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
      setTopicProgressData(enrichedLogs);

    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error('Failed to load report data.');
    } finally {
      setIsLoadingReport(false);
    }
  };

  const toggleLectureExpansion = (lectureId) => setExpandedLectures(prev => ({ ...prev, [lectureId]: !prev[lectureId] }));
  const toggleTopic = (topicIndex) => setExpandedTopics1(prev => ({ ...prev, [topicIndex]: !prev[topicIndex] }));
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleTopicChange = (topicIndex, e) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[topicIndex][e.target.name] = e.target.value;
    setFormData(prev => ({ ...prev, topics: updatedTopics }));
  };

  const addTopicField = () => setFormData(prev => ({ ...prev, topics: [...prev.topics, { name: '', url: '', duration: '' }] }));
  const removeTopicField = (index) => {
    if (formData.topics.length <= 1) return;
    const updatedTopics = [...formData.topics];
    updatedTopics.splice(index, 1);
    setFormData(prev => ({ ...prev, topics: updatedTopics }));
  };

  const resetForm = () => {
    setFormData({ class: '', subject: '', chapter: '', topics: [{ name: '', url: '', duration: '' }] });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const db = firebase.firestore();
      const lectureData = { ...formData };
      if (editingId) {
        await db.collection('sengarcarrerlectures').doc(editingId).update(lectureData);
        toast.success('Lecture updated successfully!');
      } else {
        await db.collection('lectures').add(lectureData);
        toast.success('Lecture added successfully!');
      }
      const snapshot = await db.collection('lectures').get();
      setLectures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setShowPopup(false);
      resetForm();
    } catch (error) {
      toast.error('Error saving lecture');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (lecture) => {
    setFormData({ class: lecture.class, subject: lecture.subject, chapter: lecture.chapter, topics: lecture.topics.map(t => ({ ...t })) });
    setEditingId(lecture.id);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await firebase.firestore().collection('sengarcarrerlectures').doc(id).delete();
        toast.success('Lecture deleted successfully!');
        setLectures(prev => prev.filter(l => l.id !== id));
      } catch (error) { toast.error('Error deleting lecture'); }
    }
  };
console.log("selectedprogressreport",topicProgressData)
  const handleAddTestToTopic = (lecture, topic) => {
    const queryParams = new URLSearchParams({
      lectureId: lecture.id, class: lecture.class, subject: lecture.subject, chapter: lecture.chapter, topicName: topic.name, autoOpen: 'true'
    }).toString();
    router.push(`/Admin/youtubetest/test?${queryParams}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminNav />
      <div className="md:ml-64 px-4 py-8 max-w-7xl ">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">YouTube Lectures</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage videos, assignments, and track student progress.</p>
          </div>
          <button onClick={() => setShowPopup(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center font-bold text-sm">
            <FiPlus className="mr-2" size={18} /> Add Lecture
          </button>
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {lectures.map((lecture) => (
            <div key={lecture.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
              
              {/* Accordion Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors border-b border-slate-100">
                <div className="flex-1 cursor-pointer flex items-center" onClick={() => toggleLectureExpansion(lecture.id)}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                    <FiVideo size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 leading-tight mb-1">{lecture.chapter}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{lecture.class}</span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{lecture.subject}</span>
                      <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded">{lecture.topics.length} Topics</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(lecture)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(lecture.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
                  <button onClick={() => toggleLectureExpansion(lecture.id)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg ml-2">
                    {expandedLectures[lecture.id] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Accordion Body (Topics) */}
              {expandedLectures[lecture.id] && (
                <div className="p-4 sm:p-6 bg-white">
                  <div className="space-y-3">
                    {lecture.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4 hover:border-indigo-200 transition-colors">
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{topicIndex + 1}. {topic.name}</h4>
                          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><FiClock /> {topic.duration || 'N/A'}</span>
                            <a href={topic.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                              <FaYoutube className="text-red-500" /> Watch
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button onClick={() => handleAddTestToTopic(lecture, topic)} className="flex-1 sm:flex-none flex items-center justify-center bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-sm">
                            <FiPlus className="mr-1" /> Add Test
                          </button>
                          <button onClick={() => handleViewReport(topic)} className="flex-1 sm:flex-none flex items-center justify-center bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-sm">
                            <FiBarChart2 className="mr-1" /> View Report
                          </button>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- REPORT MODAL --- */}
      {showReportPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center  justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl w-full  max-h-[100vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-black text-slate-800">Watch Progress Report</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5 text-indigo-600">{selectedTopicReport}</p>
              </div>
              <button onClick={() => setShowReportPopup(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><FiX size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingReport ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold text-slate-500">Compiling viewing data...</p>
                </div>
              ) : topicProgressData.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                  <FiBarChart2 className="mx-auto text-4xl text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-500">No watch data recorded for this video yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="min-w-full text-left border-collapse whitespace-nowrap">
  <thead>
    <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
      <th className="px-4 py-3">Student Name</th>
      <th className="px-4 py-3">Student ID</th>
      <th className="px-4 py-3">Mobile</th>
      <th className="px-4 py-3 text-center">Seconds Watched</th>
      <th className="px-4 py-3 text-center">Progress %</th>
      <th className="px-4 py-3 text-center">Test Unlocked</th>
      {/* NEW: Added Last Updated Column Header */}
      <th className="px-4 py-3 text-center">Last Updated</th> 
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-100 bg-white text-sm font-semibold text-slate-700">
    {topicProgressData.map((log, i) => (
      <tr key={i} className="hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3 font-bold text-slate-900">{i+1}. {log.studentName}</td>
        <td className="px-4 py-3 text-slate-500">{log.studentId}</td>
        <td className="px-4 py-3 text-slate-500">{log.mobile}</td>
        <td className="px-4 py-3 text-center">{log.watchedSeconds}s</td>
        <td className="px-4 py-3 text-center">
          <span className={`px-2.5 py-1 rounded-md text-xs font-black ${log.percentage >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {Math.floor(log.percentage)}%
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          {log.unlocked ? <span className="text-emerald-500 font-bold flex justify-center items-center gap-1"><FiCheckCircle /> Yes</span> : <span className="text-slate-400 font-bold flex justify-center items-center gap-1"><FiLock /> No</span>}
        </td>
        {/* NEW: Formatting and displaying the Firestore Timestamp */}
        <td className="px-4 py-3 text-center text-xs text-slate-500">
          {log.lastUpdated?.seconds ? (
            new Date(log.lastUpdated.seconds * 1000).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          ) : (
            'N/A'
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT LECTURE MODAL --- */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">{editingId ? 'Edit Lecture' : 'Add New Lecture'}</h2>
              <button onClick={() => { setShowPopup(false); resetForm(); }} className="text-slate-400 hover:text-rose-500"><FiX size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="lecture-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Class</label>
                    <select name="class" value={formData.class} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" required>
                      <option value="">Select Class</option>
                      {[...Array(12)].map((_, i) => <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" required>
                      <option value="">Select Subject</option>
                      {['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Computer Science'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Chapter Name</label>
                    <input type="text" name="chapter" value={formData.chapter} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter chapter" required />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-black text-slate-800">Topics & Videos</label>
                    <button type="button" onClick={addTopicField} className="flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      <FiPlus className="mr-1" /> Add Topic
                    </button>
                  </div>
                  
                  {formData.topics.map((topic, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="flex justify-between items-center p-3 bg-white border-b border-slate-200 cursor-pointer" onClick={() => toggleTopic(index)}>
                        <span className="text-sm font-bold text-slate-800">Topic {index + 1} {topic.name && <span className="text-indigo-600">- {topic.name}</span>}</span>
                        <div className="flex items-center gap-3">
                          {index > 0 && <button type="button" onClick={(e) => { e.stopPropagation(); removeTopicField(index); }} className="text-rose-500 hover:text-rose-700 text-xs font-bold bg-rose-50 px-2 py-1 rounded">Remove</button>}
                          {expandedTopics1[index] ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                        </div>
                      </div>
                      
                      {expandedTopics1[index] && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Topic Name</label>
                            <input type="text" name="name" value={topic.name} onChange={(e) => handleTopicChange(index, e)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-indigo-500" placeholder="Name" required />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">YouTube URL</label>
                            <input type="url" name="url" value={topic.url} onChange={(e) => handleTopicChange(index, e)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-indigo-500" placeholder="https://youtube.com/..." required />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Duration (MM:SS)</label>
                            <input type="text" name="duration" value={topic.duration || ''} onChange={(e) => handleTopicChange(index, e)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-indigo-500" placeholder="15:30" required />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowPopup(false); resetForm(); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" form="lecture-form" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update Lecture' : 'Publish Lecture'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default YouTube;