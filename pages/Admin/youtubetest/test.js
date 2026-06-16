import React, { useState, useEffect } from 'react';
import { firebase } from '../../../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import * as XLSX from 'xlsx';

const ReactQuill = dynamic(
  () => import('react-quill'),
  { 
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);
import 'react-quill/dist/quill.snow.css';

const TestSeries = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedResults, setExpandedResults] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testSeriesresult, setTestSeriesresult] = useState([]);

  // State for Main Table Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // State for sorting results and showing detailed student modal
  const [resultSort, setResultSort] = useState('highest'); 
  const [detailedStudentResult, setDetailedStudentResult] = useState(null);
  const [viewAttemptIndex, setViewAttemptIndex] = useState(0);

  // Form state - added testType alongside linkedLectureId and linkedTopicName
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    chapter: '',
    testName: '',
    testType: '', // <--- ADDED TEST TYPE
    status: 'Draft',
    testTime: '',
    date: new Date().toISOString().split('T')[0],
    linkedLectureId: '', 
    linkedTopicName: '', 
    tests: [{
      question: '',
      topic: '',
      difficulty: 'Medium',
      questionImage: null,
      options: ['', '', '', ''],
      correctOption: 0,
      description: '',
      descriptionImage: null
    }]
  });

  // Handle URL Parameters for Auto-Opening Form
  useEffect(() => {
    if (router.isReady) {
      const { autoOpen, lectureId, class: urlClass, subject, chapter, topicName } = router.query;
      
      if (autoOpen === 'true') {
        setFormData(prev => ({
          ...prev,
          class: urlClass || '',
          subject: subject || '',
          chapter: chapter || '',
          testName: topicName ? `${topicName} Test` : '',
          testType: '', // Default empty for new tests
          linkedLectureId: lectureId || '',
          linkedTopicName: topicName || ''
        }));
        
        setShowPopup(true);
        
        // Clean URL so it doesn't pop up again on page refresh
        router.replace('/Admin/youtubetest/test', undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query]);

  // Fetch test series from Firestore
  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        const db = firebase.firestore();
        const testsRef = db.collection('sengarcarreryoutubetestseries');
        const snapshot = await testsRef.get();
        const testsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestSeries(testsData);
      } catch (error) {
        toast.error('Failed to fetch test series');
        console.error('Error fetching test series:', error);
      }
    };

    fetchTestSeries();
  }, []);

  useEffect(() => {
    const fetchTestSeriesresult = async () => {
      try {
        const db = firebase.firestore();
        const testsRef = db.collection('testseriesresult');
        const snapshot = await testsRef.get();
        const testsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestSeriesresult(testsData);
      } catch (error) {
        toast.error('Failed to fetch test series results');
        console.error('Error fetching test series results:', error);
      }
    };

    fetchTestSeriesresult();
  }, []);

  // Filter Logic for Main Table
  const filteredTestSeries = testSeries.filter(test => {
    const matchClass = filterClass === '' || test.class === filterClass;
    const matchSubject = filterSubject === '' || test.subject === filterSubject;
    const matchStatus = filterStatus === '' || test.status === filterStatus;
    return matchClass && matchSubject && matchStatus;
  });

  // Unique Lists for Filter Dropdowns
  const uniqueClasses = [...new Set(testSeries.map(t => t.class))].filter(Boolean);
  const uniqueSubjects = [...new Set(testSeries.map(t => t.subject))].filter(Boolean);

  // Toggle test expansion
  const toggleTestExpansion = (testId) => {
    setExpandedTests(prev => ({ ...prev, [testId]: !prev[testId] }));
  };

  // Toggle results expansion
  const toggleResultsExpansion = (testId) => {
    setExpandedResults(prev => ({ ...prev, [testId]: !prev[testId] }));
  };

  // Get results for a specific test
  const getResultsForTest = (testId) => {
    return testSeriesresult.filter(result => result.lectureId === testId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Excel/CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error("The uploaded file is empty.");
          return;
        }

        const parsedTests = jsonData.map((row) => {
          let correctIndex = 0;
          const answerLetter = String(row['Correct Answer'] || '').trim().toUpperCase();
          if (answerLetter === 'B') correctIndex = 1;
          else if (answerLetter === 'C') correctIndex = 2;
          else if (answerLetter === 'D') correctIndex = 3;

          let rawDifficulty = String(row['Difficulty'] || row['Difficulty Level'] || row['Level'] || '').trim().toLowerCase();
          let parsedDifficulty = 'Medium'; 

          if (rawDifficulty === '1' || rawDifficulty === 'level 1' || rawDifficulty === 'easy') parsedDifficulty = 'Easy';
          else if (rawDifficulty === '3' || rawDifficulty === 'level 3' || rawDifficulty === 'hard') parsedDifficulty = 'Hard';
          else if (rawDifficulty === '2' || rawDifficulty === 'level 2' || rawDifficulty === 'medium') parsedDifficulty = 'Medium';

          return {
            question: row['Question'] || '',
            topic: row['Topic'] || '',
            difficulty: parsedDifficulty,
            questionImage: null,
            options: [
              row['Option A'] || '',
              row['Option B'] || '',
              row['Option C'] || '',
              row['Option D'] || ''
            ],
            correctOption: correctIndex,
            description: row['Explanation'] || '',
            descriptionImage: null
          };
        });

        setFormData(prev => ({ ...prev, tests: parsedTests }));
        toast.success(`Successfully loaded ${parsedTests.length} questions!`);
      } catch (error) {
        toast.error('Error parsing the file. Please ensure the headers match.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null; 
  };

  const handleTestChange = (testIndex, e) => {
    const { name, value } = e.target;
    const updatedTests = [...formData.tests];
    updatedTests[testIndex][name] = value;
    setFormData(prev => ({ ...prev, tests: updatedTests }));
  };

  const handleOptionChange = (testIndex, optionIndex, e) => {
    const { value } = e.target;
    const updatedTests = [...formData.tests];
    updatedTests[testIndex].options[optionIndex] = value;
    setFormData(prev => ({ ...prev, tests: updatedTests }));
  };

  const handleCorrectOptionChange = (testIndex, optionIndex) => {
    const updatedTests = [...formData.tests];
    updatedTests[testIndex].correctOption = optionIndex;
    setFormData(prev => ({ ...prev, tests: updatedTests }));
  };

  const handleDescriptionChange = (testIndex, value) => {
    const updatedTests = [...formData.tests];
    updatedTests[testIndex].description = value;
    setFormData(prev => ({ ...prev, tests: updatedTests }));
  };

  const handleImageUpload = async (testIndex, field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`testSeries/${Date.now()}_${file.name}`);
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();

      const updatedTests = [...formData.tests];
      updatedTests[testIndex][field] = downloadURL;
      
      setFormData(prev => ({ ...prev, tests: updatedTests }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading image');
    }
  };

  const addTestQuestion = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, {
        question: '', topic: '', difficulty: 'Medium', questionImage: null,
        options: ['', '', '', ''], correctOption: 0, description: '', descriptionImage: null
      }]
    }));
  };

  const removeTestQuestion = (testIndex) => {
    if (formData.tests.length <= 1) return;
    const updatedTests = [...formData.tests];
    updatedTests.splice(testIndex, 1);
    setFormData(prev => ({ ...prev, tests: updatedTests }));
  };

  const resetForm = () => {
    setFormData({
      class: '', subject: '', chapter: '', status: 'Draft', testName: '', testType: '', testTime: '', 
      date: new Date().toISOString().split('T')[0],
      linkedLectureId: '', 
      linkedTopicName: '',
      tests: [{
        question: '', topic: '', difficulty: 'Medium', questionImage: null,
        options: ['', '', '', ''], correctOption: 0, description: '', descriptionImage: null
      }]
    });
    setEditingId(null);
  };

  const handleSubmit = async (e, status = 'Published') => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const db = firebase.firestore();
      const finalStatus = typeof status === 'string' ? status : 'Published';

      const testData = {
        class: formData.class, 
        status: finalStatus, 
        subject: formData.subject, 
        chapter: formData.chapter,
        testName: formData.testName, 
        testType: formData.testType, // <--- SAVING TEST TYPE
        testTime: formData.testTime, 
        date: formData.date, 
        tests: formData.tests,
        linkedLectureId: formData.linkedLectureId, // Save the link
        linkedTopicName: formData.linkedTopicName, // Save the link
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      if (editingId) {
        await db.collection('sengarcarreryoutubetestseries').doc(editingId).update(testData);
        toast.success(`Test updated as ${finalStatus}!`);
      } else {
        await db.collection('sengarcarreryoutubetestseries').add(testData);
        toast.success(`Test saved as ${finalStatus}!`);
      }
      
      const snapshot = await db.collection('sengarcarreryoutubetestseries').get();
      setTestSeries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setShowPopup(false);
      resetForm();
    } catch (error) {
      toast.error('Error saving test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (test) => {
    setFormData({
      class: test.class, 
      subject: test.subject, 
      chapter: test.chapter, 
      status: test.status,
      testName: test.testName, 
      testType: test.testType || '', // <--- LOADING TEST TYPE
      testTime: test.testTime, 
      date: test.date || new Date().toISOString().split('T')[0],
      linkedLectureId: test.linkedLectureId || '',
      linkedTopicName: test.linkedTopicName || '',
      tests: test.tests?.length > 0 ? test.tests.map(t => ({
        ...t, topic: t.topic || '', difficulty: t.difficulty || 'Medium'
      })) : [{
        question: '', topic: '', difficulty: 'Medium', questionImage: null,
        options: ['', '', '', ''], correctOption: 0, description: '', descriptionImage: null
      }]
    });
    setEditingId(test.id);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        const db = firebase.firestore();
        await db.collection('sengarcarreryoutubetestseries').doc(id).delete();
        toast.success('Test deleted successfully!');
        const snapshot = await db.collection('sengarcarreryoutubetestseries').get();
        setTestSeries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        toast.error('Error deleting test');
      }
    }
  };

  // HELPER FOR DETAILED MODAL
  const getActiveAttemptData = () => {
    if (!detailedStudentResult) return null;
    if (detailedStudentResult.attempts && detailedStudentResult.attempts.length > 0) {
      return detailedStudentResult.attempts[viewAttemptIndex] || detailedStudentResult.attempts[0];
    }
    return detailedStudentResult; 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Header & Main Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 underline">Test Series Management</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Dropdowns */}
            <select 
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            {/* Clear Filters Button */}
            {(filterClass || filterSubject || filterStatus) && (
              <button 
                onClick={() => { setFilterClass(''); setFilterSubject(''); setFilterStatus(''); }}
                className="text-sm text-red-600 hover:text-red-800 font-medium ml-1"
              >
                Clear Filters
              </button>
            )}

            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-300 flex items-center ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Test
            </button>
          </div>
        </div>

        {/* Test Series Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name / Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Video</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestSeries.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                      No tests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTestSeries.map((test,index) => {
                    const rawTestResults = getResultsForTest(test.id);
                    
                    // PROCESS RESULTS FOR DASHBOARD
                    let processedResults = rawTestResults.map(result => {
                      const attempts = result.attempts || [result];
                      const totalAttempts = attempts.length;
                      const bestAttempt = attempts.reduce((best, curr) => ((curr.percentage || 0) > (best.percentage || 0) ? curr : best), attempts[0]);
                      
                      const attemptHistory = attempts.map((att, i) => ({
                        attemptNum: att.attemptNumber || i + 1,
                        percentage: att.percentage || 0,
                        score: `${att.correctAnswers || 0}/${att.totalQuestions || 1}`
                      }));

                      const topicStats = {};
                      bestAttempt.testResults?.forEach(q => {
                        const t = q.topic || 'General';
                        if (!topicStats[t]) topicStats[t] = { correct: 0, total: 0 };
                        topicStats[t].total += 1;
                        if (q.isCorrect) topicStats[t].correct += 1;
                      });
          
                      const weakTopics = Object.entries(topicStats)
                        .map(([topic, stats]) => ({ topic, accuracy: Math.round((stats.correct / stats.total) * 100) }))
                        .filter(t => t.accuracy < 70); 
          
                      return {
                        ...result,
                        attempts, 
                        totalAttempts,
                        bestAttempt,
                        attemptHistory,
                        weakTopics,
                        bestPercentage: bestAttempt.percentage || 0,
                        timeTaken: bestAttempt.timeTaken || 0,
                      };
                    });

                    // APPLY STUDENT DASHBOARD FILTER/SORT
                    if (resultSort === 'highest') processedResults.sort((a, b) => b.bestPercentage - a.bestPercentage);
                    if (resultSort === 'lowest') processedResults.sort((a, b) => a.bestPercentage - b.bestPercentage);
                    if (resultSort === 'attempts') processedResults.sort((a, b) => b.totalAttempts - a.totalAttempts);

                    return (
                      <React.Fragment key={test.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}. {test.class}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.chapter}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                            {test.testName}<br/>
                            <span className="text-[10px] text-gray-400 font-normal">{test.testType || 'N/A'}</span>
                          </td>
                          
                          {/* New Column: Show if it's linked to YouTube */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {test.linkedTopicName ? (
                               <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200 font-bold">YT: {test.linkedTopicName}</span>
                            ) : (
                               <span className="text-gray-400 text-xs">Independent</span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.testTime} mins</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                              test.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {test.status || 'Draft'}
                            </span>
                          </td>
          
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <button
                              onClick={() => toggleTestExpansion(test.id)}
                              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {expandedTests[test.id] ? 'Hide Questions' : `Show Questions (${test.tests?.length || 0})`}
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${expandedTests[test.id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <button
                              onClick={() => toggleResultsExpansion(test.id)}
                              className={`flex items-center font-medium ${rawTestResults.length > 0 ? 'text-green-600 hover:text-green-800' : 'text-gray-400'}`}
                              disabled={rawTestResults.length === 0}
                            >
                              {expandedResults[test.id] ? 'Hide Results' : `Show Results (${rawTestResults.length})`}
                              {rawTestResults.length > 0 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${expandedResults[test.id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleEdit(test)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                            <button onClick={() => handleDelete(test.id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                        
                        {/* --- EXPANDED QUESTIONS SECTION --- */}
                        {expandedTests[test.id] && (
                          <tr>
                            <td colSpan="10" className="px-6 py-4 bg-gray-50">
                              <div className="pl-4 mt-2 space-y-4 border-l-2 border-blue-400">
                                {test.tests?.map((testItem, testIndex) => (
                                  <div key={testIndex} className="ml-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="font-bold text-gray-800 text-base mb-2">Q{testIndex + 1}: {testItem.question}</div>
                                    <div className="flex gap-2 mb-4">
                                      {testItem.topic && <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs rounded-md font-bold">Topic: {testItem.topic}</span>}
                                      <span className={`px-2 py-1 text-xs rounded-md font-bold border ${testItem.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border-red-100' : testItem.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>Difficulty: {testItem.difficulty || 'Medium'}</span>
                                    </div>
                                    {testItem.questionImage && <img src={testItem.questionImage} alt="Question" className="max-w-xs rounded border border-gray-200 mb-4" />}
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                      {testItem.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className={`flex items-center p-3 rounded-lg border ${testItem.correctOption === optionIndex ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                                          <div className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold mr-3 ${testItem.correctOption === optionIndex ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                            {String.fromCharCode(65 + optionIndex)}
                                          </div>
                                          <span className={`${testItem.correctOption === optionIndex ? 'text-green-800 font-bold' : 'text-gray-700 font-medium'}`}>{option}</span>
                                          {testItem.correctOption === optionIndex && <span className="ml-auto text-[10px] font-black text-green-600 uppercase tracking-widest">Correct</span>}
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {testItem.description && (
                                      <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="text-sm font-bold text-gray-700 mb-2">Explanation:</div>
                                        <div className="text-sm text-gray-600 ql-editor p-0" dangerouslySetInnerHTML={{ __html: testItem.description }} />
                                        {testItem.descriptionImage && <img src={testItem.descriptionImage} alt="Explanation" className="max-w-xs mt-3 rounded border border-gray-200" />}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                        
                        {/* --- EXPANDED STUDENT DASHBOARD SECTION (TABLE FORMAT) --- */}
                        {expandedResults[test.id] && processedResults.length > 0 && (
                          <tr>
                            <td colSpan="10" className="p-0 border-b-2 border-indigo-500 shadow-inner">
                              <div className="bg-gray-100 p-6">
                                
                                {/* Results Header & Filters */}
                                <div className="flex flex-col md:flex-row justify-between items-center bg-white px-5 py-2 rounded-xl shadow-sm mb-6 border border-gray-200">
                                  <div>
                                    <h3 className="font-black text-xl text-gray-800 tracking-tight">Student Progress Reports</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{processedResults.length} Students Attempted</p>
                                  </div>
                                  <div className="mt-4 md:mt-0 flex items-center bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                                    <label className="text-indigo-800 font-bold text-sm mr-3">Filter/Sort:</label>
                                    <select
                                      className="bg-transparent border-none text-sm text-indigo-900 font-black focus:ring-0 py-1 cursor-pointer outline-none"
                                      value={resultSort}
                                      onChange={(e) => setResultSort(e.target.value)}
                                    >
                                      <option value="highest">Top Performers</option>
                                      <option value="lowest">Needs Improvement (Lowest First)</option>
                                      <option value="attempts">Most Attempts (Struggling)</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Student Progress Table */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Rank</th>
                                          <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Student</th>
                                          <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Best Score</th>
                                          <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Attempts</th>
                                          <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Progress Timeline</th>
                                          <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Weak Topics (&lt;70%)</th>
                                          <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-100">
                                        {processedResults.map((student, idx) => (
                                          <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                                            
                                            {/* Rank */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                              <span className="font-black text-gray-400 text-lg">#{idx + 1}</span>
                                            </td>

                                            {/* Student Info */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="flex flex-col">
                                                <span className="font-extrabold text-gray-900 text-sm">{student.userName}</span>
                                                <span className="text-xs text-gray-500">{student.userEmail}</span>
                                              </div>
                                            </td>

                                            {/* Best Score & Time */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                              <div className="flex flex-col items-center">
                                                <span className={`text-xl font-black ${student.bestPercentage >= 80 ? 'text-green-500' : student.bestPercentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                  {student.bestPercentage}%
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-semibold mt-1">
                                                  {Math.floor(student.timeTaken/60)}m {student.timeTaken%60}s
                                                </span>
                                              </div>
                                            </td>

                                            {/* Total Attempts */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                                                {student.totalAttempts}
                                              </span>
                                            </td>

                                            {/* Progress History Timeline */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="flex items-center space-x-2">
                                                {student.attemptHistory.map((history, hIdx) => (
                                                  <div key={hIdx} className="flex items-center">
                                                    <div className="flex flex-col items-center" title={`Attempt ${history.attemptNum}: ${history.score}`}>
                                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ${
                                                        history.percentage >= 80 ? 'bg-green-500' : history.percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                                      }`}>
                                                        {history.percentage}%
                                                      </div>
                                                      <span className="text-[8px] font-bold text-gray-400 mt-1">A{history.attemptNum}</span>
                                                    </div>
                                                    {hIdx < student.attemptHistory.length - 1 && (
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-300 mx-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                      </svg>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </td>

                                            {/* Weak Topics */}
                                            <td className="px-6 py-4">
                                              <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                {student.weakTopics.length > 0 ? (
                                                  student.weakTopics.map((wt, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded font-bold whitespace-nowrap">
                                                      {wt.topic} ({wt.accuracy}%)
                                                    </span>
                                                  ))
                                                ) : (
                                                  <span className="text-[10px] px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded font-bold">
                                                    No Weak Topics
                                                  </span>
                                                )}
                                              </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                              <button
                                                onClick={() => {
                                                  setDetailedStudentResult(student);
                                                  setViewAttemptIndex(student.attempts ? student.attempts.length - 1 : 0);
                                                }}
                                                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold rounded-lg transition text-xs flex items-center inline-flex border border-indigo-100"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Details
                                              </button>
                                            </td>

                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Test Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 z-50">
          <div className="bg-white shadow-xl w-full max-h-[100vh] overflow-y-auto">
            <div className="p-6">
              
              {/* Show banner if test is linked to YouTube */}
              {formData.linkedTopicName && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 font-bold">
                    This test is linked to YouTube Topic: <span className="underline">{formData.linkedTopicName}</span>
                  </p>
                </div>
              )}

              <div className="mt-2 flex justify-between items-center mb-6 border-b pb-4">
                 <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Test Series' : 'Create New Test Series'}
                 </h2>
                 <div className="flex space-x-3">
                    <button type="button" onClick={() => { setShowPopup(false); resetForm(); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50" disabled={isSubmitting}>Save as Draft</button>
                    <button type="button" onClick={(e) => handleSubmit(e, 'Published')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>{editingId ? 'Update & Publish' : 'Publish Now'}</button>
                 </div>
              </div>

              <form onSubmit={(e) => handleSubmit(e, 'Published')}>
                <div className="space-y-4">
                  {/* Test Info Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select name="class" value={formData.class} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">Select Class</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">Select Subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Computer Science">Computer Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                      <input type="text" name="chapter" value={formData.chapter} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Enter chapter name" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                      <input type="text" name="testName" value={formData.testName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Enter test name" required />
                    </div>

                    {/* NEW FIELD: Test Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type <span className="text-red-500">*</span></label>
                      <select 
                        name="testType" 
                        value={formData.testType} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                        required
                      >
                        <option value="">Select Test Type</option>
                        <option value="DPP">DPP</option>
                        <option value="Weekly">Weekly</option>
                        <option value="15 Days Test">15 Days Test</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Combined">Combined</option>
                        <option value="Progress Test">Progress Test</option>
                        <option value="One Time Test">One Time Test</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration (minutes)</label>
                      <input type="number" name="testTime" value={formData.testTime} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Enter test duration" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                  </div>

                  {/* Excel Upload Section */}
                  <div className="mt-6 p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg">
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Upload Questions via Excel/CSV (Optional)</label>
                    <p className="text-xs text-blue-600 mb-3">
                      Your file must contain the following columns: <br/>
                      <span className="font-mono">Question, Topic, Difficulty, Option A, Option B, Option C, Option D, Correct Answer, Explanation</span><br/>
                      (Correct Answer should be A, B, C, or D. Difficulty can be 1/2/3, Level 1/2/3, or Easy/Medium/Hard)
                    </p>
                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>

                  {/* Test Questions Section */}
                  <div className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Test Questions</label>
                    
                    {formData.tests.map((test, testIndex) => (
                      <div key={testIndex} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="font-black text-gray-800">Question {testIndex + 1}</span>
                          {testIndex > 0 && <button type="button" onClick={() => removeTestQuestion(testIndex)} className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 px-2 py-1 rounded">Remove</button>}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Question</label>
                          <input type="text" name="question" value={test.question} onChange={(e) => handleTestChange(testIndex, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-medium" placeholder="Enter question" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Topic</label>
                            <input type="text" name="topic" value={test.topic || ''} onChange={(e) => handleTestChange(testIndex, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-medium" placeholder="e.g. Kinematics, Algebra" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Difficulty</label>
                            <select name="difficulty" value={test.difficulty || 'Medium'} onChange={(e) => handleTestChange(testIndex, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm font-medium">
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Question Image (Optional)</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(testIndex, 'questionImage', e)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                          {test.questionImage && (
                            <div className="mt-2">
                              <img src={test.questionImage} alt="Question" className="max-w-xs max-h-40 rounded border border-gray-200" />
                              <button type="button" onClick={() => { const updatedTests = [...formData.tests]; updatedTests[testIndex].questionImage = null; setFormData(prev => ({ ...prev, tests: updatedTests })); }} className="text-red-500 text-xs mt-1 font-bold">Remove Image</button>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Options</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {test.options.map((option, optionIndex) => (
                              <div key={optionIndex} className={`flex items-center p-2 rounded-lg border ${test.correctOption === optionIndex ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'}`}>
                                <input type="radio" name={`correct-${testIndex}`} checked={test.correctOption === optionIndex} onChange={() => handleCorrectOptionChange(testIndex, optionIndex)} className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500" />
                                <div className="flex-1 flex items-center">
                                  <span className="font-black text-gray-400 mr-2 text-xs">{String.fromCharCode(65 + optionIndex)}</span>
                                  <input type="text" value={option} onChange={(e) => handleOptionChange(testIndex, optionIndex, e)} className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium" placeholder={`Option ${optionIndex + 1}`} required />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Explanation</label>
                          <div className="bg-white rounded-lg border border-gray-300">
                            <ReactQuill
                              value={test.description}
                              onChange={(value) => handleDescriptionChange(testIndex, value)}
                              modules={{ toolbar: [ ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'script': 'sub'}, { 'script': 'super' }], ['clean'] ] }}
                              theme="snow"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Explanation Image (Optional)</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(testIndex, 'descriptionImage', e)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                          {test.descriptionImage && (
                            <div className="mt-2">
                              <img src={test.descriptionImage} alt="Explanation" className="max-w-xs max-h-40 rounded border border-gray-200" />
                              <button type="button" onClick={() => { const updatedTests = [...formData.tests]; updatedTests[testIndex].descriptionImage = null; setFormData(prev => ({ ...prev, tests: updatedTests })); }} className="text-red-500 text-xs mt-1 font-bold">Remove Image</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button type="button" onClick={addTestQuestion} className="flex items-center justify-center w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500 font-bold rounded-xl transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Another Question
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAILED STUDENT RESULT MODAL --- */}
      {detailedStudentResult && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-h-[100vh] overflow-hidden flex flex-col border border-gray-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{detailedStudentResult.userName}'s Detailed Report</h2>
                <p className="text-sm font-semibold text-gray-500 mt-1">{detailedStudentResult.userEmail} | {detailedStudentResult.lectureTitle}</p>
              </div>
              <button 
                onClick={() => setDetailedStudentResult(null)} 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Modal Controls & Stats */}
            <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex flex-wrap justify-between items-center gap-4">
               {/* Attempt Selector */}
               {detailedStudentResult.attempts && detailedStudentResult.attempts.length > 0 ? (
                  <div className="flex items-center bg-white px-3 py-1.5 rounded-lg shadow-sm border border-indigo-100">
                     <label className="mr-3 font-black text-indigo-900 text-xs uppercase tracking-wider">Viewing Attempt:</label>
                     <select 
                       value={viewAttemptIndex} 
                       onChange={(e) => setViewAttemptIndex(Number(e.target.value))}
                       className="border-none text-sm font-bold text-indigo-700 bg-transparent focus:ring-0 cursor-pointer p-0 pr-6"
                     >
                       {detailedStudentResult.attempts.map((_, i) => (
                         <option key={i} value={i}>Attempt {i + 1} {i === detailedStudentResult.attempts.length - 1 ? '(Latest)' : ''}</option>
                       ))}
                     </select>
                  </div>
               ) : (
                 <div className="font-black text-indigo-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 text-sm uppercase tracking-wide">Attempt 1</div>
               )}

               {/* Score Overview for Selected Attempt */}
               {(() => {
                 const activeAttempt = getActiveAttemptData();
                 if (!activeAttempt) return null;
                 return (
                   <div className="flex items-center space-x-6 bg-white px-5 py-2 rounded-xl shadow-sm border border-indigo-100">
                     <div className="text-center pr-6 border-r border-gray-100">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Score</p>
                       <p className="font-black text-2xl text-indigo-900 leading-none">{activeAttempt.correctAnswers || 0}<span className="text-sm text-indigo-300">/{activeAttempt.totalQuestions || 1}</span></p>
                     </div>
                     <div className="text-center">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Accuracy</p>
                       <p className={`font-black text-2xl leading-none ${activeAttempt.percentage >= 80 ? 'text-green-500' : activeAttempt.percentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                         {activeAttempt.percentage || 0}%
                       </p>
                     </div>
                   </div>
                 );
               })()}
            </div>

            {/* Question List (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {(() => {
                const activeAttempt = getActiveAttemptData();
                if (!activeAttempt || !activeAttempt.testResults) return <p className="text-gray-500 italic text-center py-10 font-medium">No question data available for this attempt.</p>;

                return activeAttempt.testResults.map((q, qIndex) => (
                  <div key={qIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Question Header */}
                    <div className={`p-5 border-b ${q.isCorrect ? 'bg-green-50 border-green-100' : q.selectedOption !== null ? 'bg-red-50 border-red-100' : 'bg-gray-100 border-gray-200'} flex items-start`}>
                      <div className="mr-4 mt-1">
                        {q.isCorrect ? (
                          <div className="bg-green-500 text-white rounded-full p-1.5 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
                        ) : q.selectedOption !== null ? (
                          <div className="bg-red-500 text-white rounded-full p-1.5 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></div>
                        ) : (
                          <div className="bg-gray-400 text-white rounded-full p-1.5 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white text-indigo-700 shadow-sm border border-indigo-100">{q.topic || 'General'}</span>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border bg-white ${q.difficulty === 'Hard' ? 'text-red-700 border-red-100' : q.difficulty === 'Easy' ? 'text-green-700 border-green-100' : 'text-yellow-700 border-yellow-100'}`}>
                            {q.difficulty || 'Medium'}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg leading-snug">Q{qIndex + 1}: {q.question}</h4>
                        {q.questionImage && <img src={q.questionImage} alt="Question Graphic" className="mt-4 max-w-sm rounded-xl border border-gray-200 shadow-sm" />}
                      </div>
                    </div>

                    {/* Question Options */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                      {q.options?.map((opt, optIndex) => {
                        const isCorrectOption = optIndex === q.correctOption;
                        const isSelectedOption = optIndex === q.selectedOption;
                        
                        return (
                          <div key={optIndex} className={`p-4 rounded-xl border-2 flex items-center transition-colors ${
                            isCorrectOption ? 'border-green-400 bg-green-50' : 
                            isSelectedOption && !q.isCorrect ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'
                          }`}>
                            <span className={`flex items-center justify-center w-7 h-7 rounded-md text-sm font-black mr-4 shadow-sm ${
                              isCorrectOption ? 'bg-green-500 text-white' : 
                              isSelectedOption && !q.isCorrect ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className={`font-semibold text-sm ${isCorrectOption ? 'text-green-900' : isSelectedOption ? 'text-red-900' : 'text-gray-700'}`}>
                              {opt}
                            </span>
                            
                            {/* Badges for Correct/Selected */}
                            {isCorrectOption && <span className="ml-auto text-[10px] font-black text-green-700 bg-green-200/50 border border-green-200 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Correct Answer</span>}
                            {isSelectedOption && !q.isCorrect && <span className="ml-auto text-[10px] font-black text-red-700 bg-red-200/50 border border-red-200 px-2 py-1 rounded shadow-sm uppercase tracking-wide">Student Selected</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TestSeries;