import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import Image from 'next/image';
import { 
  FiClock, 
  FiUser, 
  FiBook, 
  FiArrowLeft, 
  FiArrowRight, 
  FiFlag, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSend,
  FiMoon,
  FiSun,
  FiLoader,
  FiAward
} from 'react-icons/fi';

const TestSeries = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { class: classLevel, subject, chapter, topic } = router.query;
  
  const [testSeries, setTestSeries] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [remainingTime, setRemainingTime] = useState(0);
  
  // Submission & Retake State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingResultId, setExistingResultId] = useState(null);
  const [attemptCount, setAttemptCount] = useState(1);
  const [noQuestionsLeft, setNoQuestionsLeft] = useState(false);
  
  // UI State
  const [darkMode, setDarkMode] = useState(true);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().collection('sengarcarreradmissions').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              setUserData(doc.data());
            } else {
              router.push('/');
            }
          })
          .catch((error) => {
            console.error("Error getting admission document:", error);
            router.push('/');
          });
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. Fetch Test Data & Previous Results
  useEffect(() => {
    if (!router.isReady || !userData) return;

    const fetchTestSeriesAndResults = async () => {
      try {
        setLoading(true);
        setNoQuestionsLeft(false);
        
        // --- A. Fetch Main Question Bank ---
        let query = firebase.firestore().collection('sengarcarrertestSeries');
        if (classLevel) query = query.where('class', '==', classLevel);
        if (subject) query = query.where('subject', '==', subject);
        if (chapter) query = query.where('chapter', '==', chapter);
        query = query.where('status', '==', 'Published');

        const snapshot = await query.get();
        const testData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // --- B. Fetch User's Previous Results for this specific test ---
        const resultsSnap = await firebase.firestore().collection('sengarcarrertestseriesresult')
          .where('userId', '==', firebase.auth().currentUser.uid)
          .where('class', '==', classLevel)
          .where('subject', '==', subject)
          .where('chapter', '==', chapter)
          .get();

        const previousResultDocs = resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const mainResultDoc = previousResultDocs[0];

        let latestAttempt = null;

        if (mainResultDoc) {
          setExistingResultId(mainResultDoc.id);
          
          if (mainResultDoc.attempts && mainResultDoc.attempts.length > 0) {
             const sortedAttempts = [...mainResultDoc.attempts].sort((a, b) => {
               const timeA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : new Date(a.submittedAt).getTime();
               const timeB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : new Date(b.submittedAt).getTime();
               return timeB - timeA;
             });
             latestAttempt = sortedAttempts[0];
             setAttemptCount(mainResultDoc.attempts.length + 1);
          } else {
             latestAttempt = mainResultDoc;
             setAttemptCount(2); 
          }
        } else {
          setAttemptCount(1);
        }

        // --- C. Determine if retake and find all topics (Correct, Incorrect, Unattempted) ---
        let isRetake = false;
        let targetCombos = []; 
        const previouslySeenQuestions = new Set(); 

        if (latestAttempt) {
          // Gather ALL previously seen questions across ALL attempts so we never repeat them
          if (mainResultDoc && mainResultDoc.attempts) {
            mainResultDoc.attempts.forEach(attempt => {
              if (attempt.testResults) {
                attempt.testResults.forEach(tr => {
                  if (tr.question) {
                    const topicKey = tr.topic || 'Uncategorized';
                    previouslySeenQuestions.add(`${topicKey}|${tr.question}`);
                  }
                });
              }
            });
          }

          // Identify ALL questions from the latest attempt regardless of status
          const previousQuestions = latestAttempt.testResults || [];

          if (previousQuestions.length > 0) {
            isRetake = true;
            const allBankQuestions = testData.flatMap(d => d.tests || []);
            const comboTracker = {};

            previousQuestions.forEach(pq => {
              let qTopic = pq.topic;
              let qDiff = pq.difficulty;

              if (!qTopic || !qDiff) {
                const original = allBankQuestions.find(bq => bq.question === pq.question);
                if (original) {
                  qTopic = original.topic;
                  qDiff = original.difficulty;
                }
              }

              qTopic = qTopic || 'Uncategorized';
              qDiff = qDiff || 'Medium';

              // Track how many questions of this specific topic and difficulty we need to replace
              const comboKey = `${qTopic}|${qDiff}`;
              if (!comboTracker[comboKey]) {
                comboTracker[comboKey] = { topic: qTopic, difficulty: qDiff, count: 0 };
              }
              comboTracker[comboKey].count += 1;
            });

            // Convert tracker object to an array for easier processing
            targetCombos = Object.values(comboTracker);
          }
        }

        setTestSeries(testData);
        
        // --- D. Process and Filter Questions ---
        if (testData.length > 0) {
          const filtered = testData.map(lecture => {
            const allQuestions = lecture.tests || [];
            let selectedQuestions = [];

            // ----- TEST TYPE CHECK -----
            if (lecture.testType === 'Progress Test') {
              if (isRetake && targetCombos.length > 0) {
                // RETAKE LOGIC: Fetch the exact number of required questions for EACH topic & level
                targetCombos.forEach(target => {
                  const matchingQuestions = allQuestions.filter(q => {
                    const qTopic = q.topic || 'Uncategorized';
                    const qDifficulty = ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium';
                    
                    return (
                      qTopic === target.topic && 
                      qDifficulty === target.difficulty &&
                      !previouslySeenQuestions.has(`${qTopic}|${q.question}`) && 
                      !selectedQuestions.some(sq => sq.question === q.question && (sq.topic || 'Uncategorized') === qTopic)
                    );
                  });
                  
                  // Shuffle matching questions and slice the exact count we need
                  if (matchingQuestions.length > 0) {
                    const shuffled = matchingQuestions.sort(() => 0.5 - Math.random());
                    const questionsToTake = shuffled.slice(0, target.count);
                    selectedQuestions.push(...questionsToTake);
                  }
                });
                
                // Final deduplication check using Topic + Question
                selectedQuestions = selectedQuestions.filter((v, i, a) => {
                  const vTopic = v.topic || 'Uncategorized';
                  return a.findIndex(t => (t.question === v.question && (t.topic || 'Uncategorized') === vTopic)) === i;
                });

              } else {
                // FIRST TIME LOGIC: 1 question from EACH level for EACH topic
                const groupedQuestions = {};

                allQuestions.forEach(q => {
                  const topic = q.topic || 'Uncategorized';
                  const level = ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium'; 
                  
                  if (!groupedQuestions[topic]) {
                    groupedQuestions[topic] = { Easy: [], Medium: [], Hard: [] };
                  }
                  
                  groupedQuestions[topic][level].push(q);
                });

                Object.keys(groupedQuestions).forEach(topic => {
                  ['Easy', 'Medium', 'Hard'].forEach(level => {
                    const availableQuestions = groupedQuestions[topic][level];
                    
                    if (availableQuestions.length > 0) {
                      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                      selectedQuestions.push(availableQuestions[randomIndex]);
                    }
                  });
                });
              }

              if (!isRetake && selectedQuestions.length === 0 && allQuestions.length > 0) {
                selectedQuestions = [allQuestions[0]]; 
              }
            } else {
              // ANY OTHER TEST TYPE: Load all questions directly
              selectedQuestions = [...allQuestions];
            }

            return {
              lectureId: lecture.id,
              lectureTitle: lecture.chapter,
              testtime: lecture.testTime || lecture.testtime || 15,
              tests: selectedQuestions
            };
          }).filter(lecture => lecture.tests.length > 0); 

          if (isRetake && filtered.length === 0) {
            setNoQuestionsLeft(true);
            setFilteredTests([]);
            setLoading(false);
            return;
          }

          setFilteredTests(filtered);
          
          if (filtered.length > 0 && filtered[0].testtime) {
            setRemainingTime(parseInt(filtered[0].testtime) * 60);
          }
        } else {
          setFilteredTests([]);
        }
      } catch (error) {
        console.error('Error fetching test series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeriesAndResults();
  }, [router.isReady, classLevel, subject, chapter, userData]);

  // 3. Timers and Unload Handlers
  useEffect(() => {
    if (remainingTime <= 0 || isSubmitted) {
      if (remainingTime <= 0 && !isSubmitted && !isSubmitting) {
        setShowTimeUpModal(true);
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, isSubmitted, isSubmitting]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted && !isSubmitting) {
        handleSubmit();
        e.preventDefault();
        e.returnValue = 'Your test will be automatically submitted. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.beforePopState(() => {
      if (!isSubmitted && !isSubmitting) {
        handleSubmit();
        return false;
      }
      return true;
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.beforePopState(() => true);
    };
  }, [isSubmitted, isSubmitting]);

  // 4. Utility Functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [currentQuestionIndex]: optionIndex
    };
    setSelectedOptions(newSelectedOptions);
    
    if (!answeredQuestions.has(currentQuestionIndex)) {
      setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));
    }
  };

  const handleQuestionNavigation = (index) => setCurrentQuestionIndex(index);

  const handleMarkForReview = () => {
    const newMarkedForReview = new Set(markedForReview);
    if (newMarkedForReview.has(currentQuestionIndex)) {
      newMarkedForReview.delete(currentQuestionIndex);
    } else {
      newMarkedForReview.add(currentQuestionIndex);
    }
    setMarkedForReview(newMarkedForReview);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredTests[0]?.tests.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // 5. Submit Handler
  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;
    
    setIsSubmitting(true);
    
    try {
      const currentTest = filteredTests[0];
      const questions = currentTest.tests;
      
      const testResults = questions.map((question, index) => ({
        question: question.question,
        description: question.description,
        questionImage: question.questionImage || null,
        options: question.options,
        correctOption: question.correctOption,
        topic: question.topic || '',                
        difficulty: question.difficulty || 'Medium', 
        selectedOption: selectedOptions[index] !== undefined ? selectedOptions[index] : null,
        isCorrect: selectedOptions[index] !== undefined 
          ? selectedOptions[index] === question.correctOption 
          : false,
        markedForReview: markedForReview.has(index)
      }));
      
      const score = testResults.reduce((acc, result) => {
        return result.isCorrect ? acc + 1 : acc;
      }, 0);
      
      const percentage = Math.round((score / questions.length) * 100);

      const currentAttemptData = {
        testResults: testResults,
        totalQuestions: questions.length,
        correctAnswers: score,
        percentage: percentage,
        timeTaken: (parseInt(currentTest.testtime || 15) * 60 - remainingTime),
        submittedAt: new Date(),
        selectedOptions: selectedOptions,
        markedForReview: Array.from(markedForReview),
        autoSubmitted: remainingTime <= 0,
        attemptNumber: attemptCount
      };

      let finalResultId;

      if (existingResultId) {
        const docRef = firebase.firestore().collection('sengarcarrertestseriesresult').doc(existingResultId);
        
        await docRef.update({
           attempts: firebase.firestore.FieldValue.arrayUnion(currentAttemptData),
           lastAttemptAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const existingData = docSnap.data();
          if ((existingData.bestPercentage || 0) < percentage) {
              await docRef.update({ bestPercentage: percentage, bestCorrectAnswers: score });
          }
        }

        finalResultId = existingResultId;
      } else {
        const testSubmission = {
          userId: firebase.auth().currentUser.uid,
          userName: userData.name,
          userEmail: userData.email,
          class: classLevel,
          subject: subject,
          chapter: chapter,
          testId: currentTest.lectureId,
          lectureTitle: currentTest.lectureTitle || '',
          attempts: [currentAttemptData],
          bestPercentage: percentage,
          bestCorrectAnswers: score,
          totalQuestions: questions.length,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastAttemptAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await firebase.firestore().collection('sengarcarrertestseriesresult').add(testSubmission);
        finalResultId = docRef.id;
      }
      
      setIsSubmitted(true);
      router.push(`/Student/mytestresult?id=${finalResultId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      setIsSubmitting(false);
    }
  };

  // 6. Renders
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${darkMode ? 'border-blue-400' : 'border-blue-600'} border-t-transparent rounded-full animate-spin mx-auto`}></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Loading test series...</p>
        </div>
      </div>
    );
  }

  if (noQuestionsLeft) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className={`text-center p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full transition-colors duration-200`}>
          <div className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <FiAward className={`text-5xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Awesome Effort!</h2>
          <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
  You have thoroughly covered the practice exercises for your focus areas. To further strengthen your foundation and improve your weak points, we recommend reviewing the core concepts in the study materials before your next attempt.
</p>
          <button 
            onClick={() => router.back()} 
            className={`${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center w-full`}
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!filteredTests.length) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className={`text-center p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full transition-colors duration-200`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No Tests Found</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>We couldn't find any tests for the selected criteria.</p>
          <button 
            onClick={() => router.back()} 
            className={`${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center mx-auto`}
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentTest = filteredTests[0];
  const questions = currentTest.tests;
  const currentQuestion = questions[currentQuestionIndex];

  const getQuestionStatus = (index) => {
    if (markedForReview.has(index)) return 'marked';
    if (answeredQuestions.has(index)) return 'answered';
    if (selectedOptions[index] !== undefined) return 'answered';
    return 'not-visited';
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-200`}>
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-200`}>
            <div className="text-center">
              <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Time's Up!</h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your test has been automatically submitted as the time has ended.
              </p>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" />
                  <span>Submitting your test...</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowTimeUpModal(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-lg transition-colors duration-200 sticky top-0 z-10`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}> {topic}</h1>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} flex items-center`}>
                <FiBook className="mr-1" />{classLevel} - {subject}
              </p>
              <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} flex items-center justify-center`}>
                <FiUser className="mr-1" /> Candidate
              </p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.name}</p>
            </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          
            <div className={`text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} px-4 py-2 rounded-lg transition-colors duration-200`}>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} flex items-center justify-center`}>
                <FiClock className="mr-1" /> Time Remaining
              </p>
              <p className={`font-medium text-xl ${remainingTime <= 60 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTime(remainingTime)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className={`lg:w-3/5 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex justify-between items-center mb-6">
            <span className={`${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button 
              onClick={handleMarkForReview}
              className={`px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200 ${
                markedForReview.has(currentQuestionIndex) 
                  ? `${darkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-500 hover:bg-purple-600'} text-white` 
                  : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-blue-300' : 'text-blue-600'}`
              }`}
            >
              <FiFlag className="mr-2" />
              {markedForReview.has(currentQuestionIndex) 
                ? 'Unmark Review' 
                : 'Mark for Review'}
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentQuestion.question}</h3>
            </div>
            {currentQuestion.questionImage && (
              <div className={`mb-6 relative h-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <Image
                  src={currentQuestion.questionImage}
                  alt="Question"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-start ${
                  selectedOptions[currentQuestionIndex] === index
                    ? `${darkMode ? 'border-blue-400 bg-blue-900 bg-opacity-30' : 'border-blue-500 bg-blue-100'}`
                    : `${darkMode ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-100'}`
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 mt-0.5 mr-3 rounded-full flex-shrink-0 ${
                  selectedOptions[currentQuestionIndex] === index
                    ? 'bg-blue-500 text-white'
                    : `${darkMode ? 'bg-gray-600 text-blue-300 border border-gray-500' : 'bg-gray-200 text-blue-600 border border-gray-300'}`
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={darkMode ? 'text-white' : 'text-gray-800'}>{option}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                currentQuestionIndex === 0 
                  ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed` 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <FiArrowLeft className="mr-2" />
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-6 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                currentQuestionIndex === questions.length - 1 
                  ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed` 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              Next
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        <div className={`lg:w-2/5 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-colors duration-200`}>
          <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Question Status</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Answered</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Not Answered</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Marked Review</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index);
              const isCurrent = index === currentQuestionIndex;
              let bgColor = darkMode ? 'bg-gray-700' : 'bg-gray-200';
              
              if (isCurrent) bgColor = 'bg-blue-600';
              else if (status === 'answered') bgColor = 'bg-green-600';
              else if (status === 'marked') bgColor = 'bg-purple-600';
              
              return (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor} ${
                    isCurrent ? 'ring-2 ring-blue-400' : ''
                  } hover:opacity-90 transition text-white`}
                >
                  {index + 1}
                </button>
              );
            })} 
          </div>

          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-6 transition-colors duration-200`}>
            <div className="flex justify-between mb-2">
              <span className={darkMode ? 'text-blue-300' : 'text-blue-600'}>Answered:</span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>{answeredQuestions.size}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className={darkMode ? 'text-blue-300' : 'text-blue-600'}>Not Answered:</span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>{questions.length - answeredQuestions.size}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-blue-300' : 'text-blue-600'}>Marked for Review:</span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>{markedForReview.size}</span>
            </div>
          </div>

          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
              className={`w-full py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center ${
                isSubmitting || isSubmitted
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : isSubmitted ? (
                <>
                  <FiCheckCircle className="mr-2" />
                  Submitted
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Submit Test
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestSeries;