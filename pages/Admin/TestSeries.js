import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import * as XLSX from 'xlsx';
import AdminNav from '@/components/AdminNav'

const ReactQuill = dynamic(
  () => import('react-quill'),
  { 
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);
import 'react-quill/dist/quill.snow.css';

// Helper function for dependent target classes
const getTargetClassOptions = (program) => {
  switch(program) {
    case 'Target': return [
      { value: 'Target 12th+ NEET', label: '12th+ NEET' },
      { value: 'Target 12th+ IIT JEE', label: '12th+ IIT JEE' }
    ];
    case 'Foundation': return [
      { value: 'Foundation 11th NEET', label: '11th NEET' },
      { value: 'Foundation 11th IIT JEE', label: '11th IIT JEE' },
      { value: 'Foundation 12th NEET', label: '12th NEET' },
      { value: 'Foundation 12th IIT JEE', label: '12th IIT JEE' }
    ];
    case 'School With Foundation':
    case 'Board Batch': return [
      { value: `${program} 9th`, label: '9th' },
      { value: `${program} 10th`, label: '10th' },
      { value: `${program} 11th Math`, label: '11th Math' },
      { value: `${program} 11th Bio`, label: '11th Bio' },
      { value: `${program} 12th Math`, label: '12th Math' },
      { value: `${program} 12th Bio`, label: '12th Bio' }
    ];
    default: return [];
  }
};

const TestSeries = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedResults, setExpandedResults] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testSeriesresult, setTestSeriesresult] = useState([]);

  // State for Main Table Filters (Updated for Program/Class cascade)
  const [filterProgram, setFilterProgram] = useState('');
  const [filterTargetClass, setFilterTargetClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // State for sorting results and showing detailed student modal
  const [resultSort, setResultSort] = useState('highest'); 
  const [detailedStudentResult, setDetailedStudentResult] = useState(null);
  const [viewAttemptIndex, setViewAttemptIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [resultPages, setResultPages] = useState({});
  const resultItemsPerPage = 8;
  // Form state - Added testType
  const [formData, setFormData] = useState({
    admissionFor: '',
    targetClass: [],
    subject: '',
    chapter: '',
    testName: '',
    testType: '',
    status: 'Draft',
    testTime: '', // duration in minutes
    testStartTime: '', // NEW: start time like 10:30
    date: new Date().toISOString().split('T')[0],
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

  // Fetch test series from Firestore
  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        setLoading(true);
  
        const db = firebase.firestore();
        const testsRef = db.collection('sengarcarrertestSeries')
        const snapshot = await testsRef.get();
  
        const testsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        setTestSeries(testsData);
      } catch (error) {
        toast.error('Failed to fetch test series');
        console.error('Error fetching test series:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTestSeries();
  }, []);

  useEffect(() => {
    const fetchTestSeriesresult = async () => {
      try {
        const db = firebase.firestore();
        const testsRef = db.collection('sengarcarrertestseriesresult');
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
    // Extract array of classes safely (handling legacy comma-separated strings if present)
    let testClasses = [];
    if (test.targetClass && test.targetClass.length > 0) {
      testClasses = test.targetClass;
    } else if (test.class) {
      testClasses = test.class.split(',').map(c => c.trim());
    }

    const matchProgram = filterProgram === '' || test.admissionFor === filterProgram;
    const matchClass = filterTargetClass === '' || testClasses.includes(filterTargetClass);
    const matchSubject = filterSubject === '' || test.subject === filterSubject;
    const matchStatus = filterStatus === '' || test.status === filterStatus;
    
    return matchProgram && matchClass && matchSubject && matchStatus;
  });

  // Unique Lists for Filter Dropdowns (flattens array if they have multiple targets)
  const uniqueClasses = [...new Set(testSeries.flatMap(t => {
    if (t.targetClass && t.targetClass.length > 0) return t.targetClass;
    if (t.class) return t.class.split(',').map(c => c.trim());
    return [];
  }))].filter(Boolean);
  
  const uniqueSubjects = [...new Set(testSeries.map(t => t.subject))].filter(Boolean);
  const totalPages = Math.ceil(filteredTestSeries.length / itemsPerPage);

  const paginatedTestSeries = filteredTestSeries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filterProgram, filterTargetClass, filterSubject, filterStatus, itemsPerPage]);
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
      admissionFor: '',
      targetClass: [],
      subject: '',
      chapter: '',
      status: 'Draft',
      testName: '',
      testType: '',
      testTime: '',
      testStartTime: '',
      date: new Date().toISOString().split('T')[0],
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
  
    setEditingId(null);
  };

  const handleSubmit = async (e, status = 'Published') => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    // Multiselect Validation Check
    if (!formData.targetClass || formData.targetClass.length === 0) {
      toast.error('Please select at least one Target Course/Class!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const db = firebase.firestore();
      const finalStatus = typeof status === 'string' ? status : 'Published';

      const testData = {
        admissionFor: formData.admissionFor,
        targetClass: formData.targetClass,
        class: formData.targetClass.join(', '),
      
        status: finalStatus,
        subject: formData.subject,
        chapter: formData.chapter,
        testName: formData.testName,
        testType: formData.testType,
      
        testTime: formData.testTime, // duration
        testStartTime: formData.testStartTime, // NEW start time
        date: formData.date,
      
        // Useful combined field for sorting/display
        testDateTime: formData.date && formData.testStartTime
          ? `${formData.date}T${formData.testStartTime}`
          : '',
      
        tests: formData.tests,
      
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...(editingId ? {} : {
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      };
      
      if (editingId) {
        await db.collection('testSeries').doc(editingId).update(testData);
        toast.success(`Test updated as ${finalStatus}!`);
      } else {
        await db.collection('testSeries').add(testData);
        toast.success(`Test saved as ${finalStatus}!`);
      }
      
      const snapshot = await db.collection('testSeries').orderBy('createdAt', 'desc').get();

      setTestSeries(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
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
      admissionFor: test.admissionFor || '',
      targetClass: test.targetClass || (test.class ? test.class.split(',').map(c => c.trim()) : []),
      subject: test.subject || '',
      chapter: test.chapter || '',
      status: test.status || 'Draft',
      testName: test.testName || '',
      testType: test.testType || '',
      testTime: test.testTime || '',
      testStartTime: test.testStartTime || '',
      date: test.date || new Date().toISOString().split('T')[0],
      tests: test.tests?.length > 0 ? test.tests.map(t => ({
        ...t,
        topic: t.topic || '',
        difficulty: t.difficulty || 'Medium'
      })) : [{
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
    setEditingId(test.id);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        const db = firebase.firestore();
        await db.collection('sengarcarrertestSeries').doc(id).delete();
        toast.success('Test deleted successfully!');
        const snapshot = await db.collection('testSeries').get();
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
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminNav/>
      <div className="md:ml-64 px-4 py-8">
        
        {/* Header & Main Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-xl font-bold text-gray-800 underline">Test Series Management</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter 1: Program */}
            <select 
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterProgram}
              onChange={(e) => {
                setFilterProgram(e.target.value);
                setFilterTargetClass(''); // Reset class filter when program changes
              }}
            >
              <option value="">All Programs</option>
              <option value="Foundation">Foundation Program</option>
              <option value="Target">Target (12th+)</option>
              <option value="School With Foundation">School With Foundation</option>
              <option value="Board Batch">Board Batch</option>
            </select>

            {/* Filter 2: Classes (Cascades based on Program) */}
            <select 
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterTargetClass}
              onChange={(e) => setFilterTargetClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {filterProgram 
                ? getTargetClassOptions(filterProgram).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
                : uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)
              }
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
            {(filterProgram || filterTargetClass || filterSubject || filterStatus) && (
              <button 
                onClick={() => { setFilterProgram(''); setFilterTargetClass(''); setFilterSubject(''); setFilterStatus(''); }}
                className="text-sm text-red-600 hover:text-red-800 font-medium ml-1"
              >
                Clear Filters
              </button>
            )}

            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs font-bold rounded-lg shadow-md transition duration-300 flex items-center ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Test
            </button>
          </div>
        </div>

        {/* Test Series Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-2 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Program/Class</th>
          <th className="px-2 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Subject/Chap</th>
          <th className="px-2 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Test/Type</th>
          <th className="px-2 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date/Duration</th>
          <th className="px-2 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Questions</th>
          <th className="px-2 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Results</th>
          <th className="px-2 py-1.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {filteredTestSeries.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-4 py-6 text-center text-xs text-gray-500">
              No tests found matching your filters.
            </td>
          </tr>
        ) : (
          paginatedTestSeries.map((test, index) => {
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

            // Multi-class display
            const displayClasses = test.targetClass && test.targetClass.length > 0
              ? test.targetClass.join(', ')
              : test.class;

            return (
              <React.Fragment key={test.id}>
                <tr className="hover:bg-gray-50 group">
                  <td className="px-2 py-1.5 whitespace-nowrap text-xs font-medium text-indigo-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}. {test.admissionFor || 'N/A'}/{displayClasses}
                  </td>

                  <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600">
                    <span className="font-medium">{test.subject}</span><br />
                    <span className="text-[10px] text-gray-400">{test.chapter}</span>
                  </td>

                  <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600">
                    {test.testName}<br />
                    <span className="text-[10px] text-gray-400">{test.testType || 'N/A'}</span>
                  </td>
                  
                  <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600">
                  <div className="font-semibold text-gray-700">
  {test.date || 'No Date'}
</div>
<div className="text-[10px] text-gray-500">
  Start: {test.testStartTime || 'N/A'} | Duration: {test.testTime || 0}m
</div>
                    <span className={`inline-block mt-0.5 px-1.5 py-0.5 text-[9px] rounded font-bold ${test.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {test.status || 'Draft'}
                    </span>
                  </td>

                  <td className="px-2 py-1.5 text-xs">
                    <button
                      onClick={() => toggleTestExpansion(test.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {expandedTests[test.id] ? 'Hide' : `Show (${test.tests?.length || 0})`}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ml-0.5 transition-transform ${expandedTests[test.id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  
                  <td className="px-2 py-1.5 text-xs">
                    <button
                      onClick={() => toggleResultsExpansion(test.id)}
                      className={`flex items-center font-medium ${rawTestResults.length > 0 ? 'text-green-600 hover:text-green-800' : 'text-gray-400'}`}
                      disabled={rawTestResults.length === 0}
                    >
                      {expandedResults[test.id] ? 'Hide' : `Show (${rawTestResults.length})`}
                      {rawTestResults.length > 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ml-0.5 transition-transform ${expandedResults[test.id] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </td>
                  
                  <td className="px-2 py-1.5 whitespace-nowrap text-xs font-medium text-right">
                    <button onClick={() => handleEdit(test)} className="text-indigo-600 hover:text-indigo-800 mr-2">Edit</button>
                    <button onClick={() => handleDelete(test.id)} className="text-red-600 hover:text-red-800">Del</button>
                  </td>
                </tr>

                {/* --- EXPANDED QUESTIONS SECTION --- */}
                {expandedTests[test.id] && (
                  <tr>
                    <td colSpan="7" className="p-0 border-b border-gray-200">
                      <div className="bg-gray-50/50 p-2 pl-4 border-l-2 border-blue-400">
                        <div className="space-y-2">
                          {test.tests?.map((testItem, testIndex) => (
                            <div key={testIndex} className="p-2.5 bg-white border border-gray-200 rounded shadow-sm">
                              <div className="font-semibold text-gray-800 text-xs mb-1.5 flex justify-between items-start">
                                <span>Q{testIndex + 1}: {testItem.question}</span>
                                <div className="flex gap-1 ml-2 flex-shrink-0">
                                  {testItem.topic && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] rounded font-semibold">{testItem.topic}</span>}
                                  <span className={`px-1.5 py-0.5 text-[9px] rounded font-semibold border ${testItem.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border-red-100' : testItem.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>{testItem.difficulty || 'Med'}</span>
                                </div>
                              </div>
                              
                              {testItem.questionImage && <img src={testItem.questionImage} alt="Question" className="max-w-[200px] rounded border border-gray-200 mb-2" />}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
                                {testItem.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className={`flex items-center p-1.5 rounded border text-xs ${testItem.correctOption === optionIndex ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className={`w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold mr-2 ${testItem.correctOption === optionIndex ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </div>
                                    <span className={`truncate ${testItem.correctOption === optionIndex ? 'text-green-800 font-semibold' : 'text-gray-600'}`}>{option}</span>
                                  </div>
                                ))}
                              </div>

                              {testItem.description && (
                                <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex flex-col sm:flex-row sm:gap-4">
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-500 block mb-0.5">Explanation:</span>
                                    <div className="text-[11px] text-gray-600 ql-editor p-0 leading-tight" dangerouslySetInnerHTML={{ __html: testItem.description }} />
                                  </div>
                                  {testItem.descriptionImage && <img src={testItem.descriptionImage} alt="Explanation" className="max-w-[150px] mt-1 sm:mt-0 rounded border border-gray-200" />}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* --- EXPANDED STUDENT DASHBOARD SECTION --- */}
                {expandedResults[test.id] && processedResults.length > 0 && (
                  <tr>
                    <td colSpan="7" className="p-0 border-b-2 border-indigo-400">
                      <div className="bg-slate-50 p-2 md:p-3">
                        
                        {/* Results Header & Filters */}
                        <div className="flex flex-wrap justify-between items-center bg-white px-3 py-1.5 rounded shadow-sm mb-2 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-gray-800">Progress Reports</h3>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{processedResults.length} Attempted</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <label className="text-indigo-800 font-semibold mr-1.5">Sort:</label>
                            <select
                              className="bg-indigo-50 border border-indigo-100 rounded text-indigo-900 font-medium focus:ring-0 py-0.5 px-1 cursor-pointer outline-none text-[11px]"
                              value={resultSort}
                              onChange={(e) => setResultSort(e.target.value)}
                            >
                              <option value="highest">Top Scores</option>
                              <option value="lowest">Lowest Scores</option>
                              <option value="attempts">Most Attempts</option>
                            </select>
                          </div>
                        </div>

                        {/* Student Progress Table */}
                        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-2 py-1.5 text-left text-[10px] font-bold text-gray-500 uppercase">Rk</th>
                                  <th className="px-2 py-1.5 text-left text-[10px] font-bold text-gray-500 uppercase">Student</th>
                                  <th className="px-2 py-1.5 text-center text-[10px] font-bold text-gray-500 uppercase">Best</th>
                                  <th className="px-2 py-1.5 text-center text-[10px] font-bold text-gray-500 uppercase">Att</th>
                                  <th className="px-2 py-1.5 text-left text-[10px] font-bold text-gray-500 uppercase">Timeline</th>
                                  <th className="px-2 py-1.5 text-left text-[10px] font-bold text-gray-500 uppercase">Weak (&lt;70%)</th>
                                  <th className="px-2 py-1.5 text-right text-[10px] font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                {processedResults.map((student, idx) => (
                                  <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-2 py-1.5 whitespace-nowrap text-center text-xs font-bold text-gray-400">
                                      #{idx + 1}
                                    </td>

                                    <td className="px-2 py-1.5 whitespace-nowrap">
                                      <div className="text-xs font-bold text-gray-800">{student.userName}</div>
                                      <div className="text-[10px] text-gray-500">{student.userEmail}</div>
                                    </td>

                                    <td className="px-2 py-1.5 whitespace-nowrap text-center">
                                      <div className={`text-sm font-black ${student.bestPercentage >= 80 ? 'text-green-500' : student.bestPercentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                        {student.bestPercentage}%
                                      </div>
                                      <div className="text-[9px] text-gray-400 font-medium">
                                        {Math.floor(student.timeTaken/60)}m {student.timeTaken%60}s
                                      </div>
                                    </td>

                                    <td className="px-2 py-1.5 whitespace-nowrap text-center">
                                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold border border-indigo-100">
                                        {student.totalAttempts}
                                      </span>
                                    </td>

                                    <td className="px-2 py-1.5 whitespace-nowrap">
                                      <div className="flex items-center gap-0.5">
                                        {student.attemptHistory.map((history, hIdx) => (
                                          <div key={hIdx} className="flex items-center" title={`Att ${history.attemptNum}: ${history.score}`}>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white ${
                                              history.percentage >= 80 ? 'bg-green-500' : history.percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                            }`}>
                                              {history.percentage}
                                            </div>
                                            {hIdx < student.attemptHistory.length - 1 && (
                                              <span className="text-gray-300 text-[10px] mx-0.5">›</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </td>

                                    <td className="px-2 py-1.5">
                                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {student.weakTopics.length > 0 ? (
                                          student.weakTopics.map((wt, i) => (
                                            <span key={i} className="text-[9px] px-1 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded font-semibold whitespace-nowrap">
                                              {wt.topic} ({wt.accuracy}%)
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-[9px] px-1 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded font-semibold">
                                            None
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-2 py-1.5 whitespace-nowrap text-right">
                                      <button
                                        onClick={() => {
                                          setDetailedStudentResult(student);
                                          setViewAttemptIndex(student.attempts ? student.attempts.length - 1 : 0);
                                        }}
                                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded transition text-[10px] border border-indigo-100"
                                      >
                                        View
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
<div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-3 py-3 border-t border-gray-200 bg-gray-50">
  <div className="text-xs text-gray-600">
    Showing{' '}
    <span className="font-bold">
      {filteredTestSeries.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
    </span>
    {' '}to{' '}
    <span className="font-bold">
      {Math.min(currentPage * itemsPerPage, filteredTestSeries.length)}
    </span>
    {' '}of{' '}
    <span className="font-bold">{filteredTestSeries.length}</span>
    {' '}tests
  </div>

  <div className="flex items-center gap-2">
    <select
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
    >
      <option value={5}>5 / page</option>
      <option value={10}>10 / page</option>
      <option value={20}>20 / page</option>
      <option value={50}>50 / page</option>
    </select>

    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 text-xs rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Prev
    </button>

    <span className="text-xs font-semibold text-gray-700">
      Page {currentPage} of {totalPages || 1}
    </span>

    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages || totalPages === 0}
      className="px-3 py-1 text-xs rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Next
    </button>
  </div>
</div>
      </div>

      {/* Add/Edit Test Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 z-50">
          <div className="bg-white shadow-xl w-full max-h-[100vh] overflow-y-auto">
            <div className="p-6">
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => { setShowPopup(false); resetForm(); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50" disabled={isSubmitting}>Save as Draft</button>
                <button type="button" onClick={(e) => handleSubmit(e, 'Published')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>{editingId ? 'Update & Publish' : 'Publish Now'}</button>
              </div>

              <form onSubmit={(e) => handleSubmit(e, 'Published')}>
                <div className="space-y-4 mt-6">
                  
                  {/* Test Info Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* NEW: Multi-select Logic wrapped in a stylized container to span 2 columns */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                      {/* 1. Program Applying For */}
                      <div>
                        <label className="block text-sm font-semibold text-indigo-900 mb-2">Program Applying For <span className="text-red-500">*</span></label>
                        <select 
                          name="admissionFor" 
                          value={formData.admissionFor || ''} 
                          onChange={(e) => setFormData(prev => ({ ...prev, admissionFor: e.target.value, targetClass: [] }))} 
                          className="w-full px-4 py-2.5 border border-indigo-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm" 
                          required
                        >
                          <option value="">-- Select Program --</option>
                          <option value="Foundation">Foundation Program</option>
                          <option value="Target">Target (12th+)</option>
                          <option value="School With Foundation">School With Foundation</option>
                          <option value="Board Batch">Board Batch</option>
                        </select>
                      </div>

                      {/* 2. Target Course / Class (Multi-Select using Checkboxes) */}
                      {formData.admissionFor && (
                        <div className="animate-fadeIn">
                          <label className="block text-sm font-semibold text-indigo-900 mb-2">Target Course/Class (Select Multiple) <span className="text-red-500">*</span></label>
                          <div className="bg-white border border-indigo-200 rounded-xl p-3 max-h-48 overflow-y-auto shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {getTargetClassOptions(formData.admissionFor).map(option => (
                              <label key={option.value} className="flex items-center space-x-3 p-2.5 hover:bg-indigo-50 rounded-lg cursor-pointer border border-transparent hover:border-indigo-100 transition-colors">
                                <input 
                                  type="checkbox"
                                  checked={formData.targetClass?.includes(option.value) || false}
                                  onChange={(e) => {
                                    const val = option.value;
                                    setFormData(prev => {
                                      const current = prev.targetClass || [];
                                      if (e.target.checked) return { ...prev, targetClass: [...current, val] };
                                      return { ...prev, targetClass: current.filter(c => c !== val) };
                                    });
                                  }}
                                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-800">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
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
                        <option value="Combined">Combined</option>
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

                    {/* FIELD MODIFIED: Test Type */}
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
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Test Date
  </label>
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleInputChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
    required
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Test Start Time
  </label>
  <input
    type="time"
    name="testStartTime"
    value={formData.testStartTime}
    onChange={handleInputChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
    required
  />
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
  <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-2 backdrop-blur-sm">
    <div className="bg-gray-50 rounded-lg shadow-2xl w-full  max-h-[96vh] overflow-hidden flex flex-col border border-gray-200">
      
      {/* Modal Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">{detailedStudentResult.userName}'s Report</h2>
          <p className="text-[11px] font-medium text-gray-500">{detailedStudentResult.userEmail} | {detailedStudentResult.lectureTitle}</p>
        </div>
        <button 
          onClick={() => setDetailedStudentResult(null)} 
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      {/* Modal Controls & Stats */}
      <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap justify-between items-center gap-3">
          {/* Attempt Selector */}
          {detailedStudentResult.attempts && detailedStudentResult.attempts.length > 0 ? (
            <div className="flex items-center bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">
                <label className="mr-2 font-bold text-indigo-800 text-[10px] uppercase">Attempt:</label>
                <select 
                  value={viewAttemptIndex} 
                  onChange={(e) => setViewAttemptIndex(Number(e.target.value))}
                  className="border-none text-xs font-bold text-indigo-700 bg-transparent focus:ring-0 cursor-pointer p-0 pr-4"
                >
                  {detailedStudentResult.attempts.map((_, i) => (
                    <option key={i} value={i}>#{i + 1} {i === detailedStudentResult.attempts.length - 1 ? '(Latest)' : ''}</option>
                  ))}
                </select>
            </div>
          ) : (
            <div className="font-bold text-indigo-800 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100 text-[10px] uppercase">Attempt 1</div>
          )}

          {/* Score Overview for Selected Attempt */}
          {(() => {
            const activeAttempt = getActiveAttemptData();
            if (!activeAttempt) return null;
            return (
              <div className="flex items-center space-x-4 bg-white px-3 py-1.5 rounded shadow-sm border border-indigo-100">
                <div className="text-center pr-4 border-r border-gray-100 flex items-center gap-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Score</p>
                  <p className="font-black text-lg text-indigo-900 leading-none">{activeAttempt.correctAnswers || 0}<span className="text-xs text-indigo-400">/{activeAttempt.totalQuestions || 1}</span></p>
                </div>
                <div className="text-center flex items-center gap-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Acc</p>
                  <p className={`font-black text-lg leading-none ${activeAttempt.percentage >= 80 ? 'text-green-500' : activeAttempt.percentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                    {activeAttempt.percentage || 0}%
                  </p>
                </div>
              </div>
            );
          })()}
      </div>

      {/* Question List (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-100">
        {(() => {
          const activeAttempt = getActiveAttemptData();
          if (!activeAttempt || !activeAttempt.testResults) return <p className="text-gray-500 italic text-center py-6 text-xs font-medium">No question data available.</p>;

          return activeAttempt.testResults.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              {/* Question Header */}
              <div className={`p-3 border-b ${q.isCorrect ? 'bg-green-50/50 border-green-100' : q.selectedOption !== null ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-200'} flex items-start`}>
                <div className="mr-3 mt-0.5">
                  {q.isCorrect ? (
                    <div className="bg-green-500 text-white rounded p-1 shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>
                  ) : q.selectedOption !== null ? (
                    <div className="bg-red-500 text-white rounded p-1 shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></div>
                  ) : (
                    <div className="bg-gray-400 text-white rounded p-1 shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">{q.topic || 'General'}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${q.difficulty === 'Hard' ? 'text-red-700 bg-red-50 border-red-100' : q.difficulty === 'Easy' ? 'text-green-700 bg-green-50 border-green-100' : 'text-yellow-700 bg-yellow-50 border-yellow-100'}`}>
                      {q.difficulty || 'Medium'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-xs leading-snug">Q{qIndex + 1}: {q.question}</h4>
                  {q.questionImage && <img src={q.questionImage} alt="Graphic" className="mt-2 max-w-[200px] rounded border border-gray-200 shadow-sm" />}
                </div>
              </div>

              {/* Question Options */}
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                {q.options?.map((opt, optIndex) => {
                  const isCorrectOption = optIndex === q.correctOption;
                  const isSelectedOption = optIndex === q.selectedOption;
                  
                  return (
                    <div key={optIndex} className={`p-2 rounded border flex items-center transition-colors ${
                      isCorrectOption ? 'border-green-300 bg-green-50/30' : 
                      isSelectedOption && !q.isCorrect ? 'border-red-300 bg-red-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                    }`}>
                      <span className={`flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold mr-2.5 shadow-sm shrink-0 ${
                        isCorrectOption ? 'bg-green-500 text-white' : 
                        isSelectedOption && !q.isCorrect ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className={`font-medium text-xs truncate ${isCorrectOption ? 'text-green-800' : isSelectedOption ? 'text-red-800' : 'text-gray-700'}`}>
                        {opt}
                      </span>
                      
                      {/* Badges for Correct/Selected */}
                      {isCorrectOption && <span className="ml-auto text-[8px] font-bold text-green-700 bg-green-100 border border-green-200 px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider shrink-0">Correct</span>}
                      {isSelectedOption && !q.isCorrect && <span className="ml-auto text-[8px] font-bold text-red-700 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider shrink-0">Selected</span>}
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