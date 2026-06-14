import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiClock, 
  FiBook, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSend,
  FiPlay,
  FiInfo,
  FiAward,
  FiWifi,
  FiNavigation,
  FiBarChart2,
  FiHelpCircle
} from 'react-icons/fi';

const TestStart = () => {
    const router = useRouter();
    const { id } = router.query;
    const [test, setTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchTest = async () => {
            setIsLoading(true);
            try {
                const db = firebase.firestore();
                const doc = await db.collection('testSeries').doc(id).get();
                
                if (doc.exists) {
                    setTest({
                        id: doc.id,
                        ...doc.data()
                    });
                    
                    const initialAnswers = {};
                    doc.data().questions?.forEach((q, index) => {
                        initialAnswers[index] = null;
                    });
                    setAnswers(initialAnswers);
                    
                    const durationInMinutes = parseInt(doc.data().duration) || 30;
                    setTimeLeft(durationInMinutes * 60);
                } else {
                    toast.error('Test not found');
                    router.push('/test-series');
                }
            } catch (error) {
                toast.error('Error fetching test: ' + error.message);
                router.push('/test-series');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    useEffect(() => {
        if (!isTestStarted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isTestStarted, timeLeft]);

    const handleStartTest = () => {
        setIsTestStarted(true);
    };

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmitTest = () => {
        let score = 0;
        test.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score += 1;
            }
        });

        toast.success(`Test submitted! Your score: ${score}/${test.questions.length}`);
        router.push('/test-series');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleQuestionNavClick = (index) => {
        setCurrentQuestionIndex(index);
    };

    const calculateAttemptStats = () => {
        const attempted = Object.values(answers).filter(a => a !== null).length;
        const unattempted = test.questions.length - attempted;
        return { attempted, unattempted };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-navy-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-navy-900">
                <p className="text-blue-100">Test not found</p>
            </div>
        );
    }

    if (!isTestStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-navy-900 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <div className="bg-gradient-to-r from-blue-700 to-navy-800 px-8 py-8">
                        <div className="flex items-center">
                            <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm">
                                <FiBook className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{test.testName}</h1>
                                <div className="flex flex-wrap items-center mt-2 gap-2 text-blue-100">
                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center">
                                        <FiInfo className="mr-1" /> {test.subjects}
                                    </span>
                                    <span className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                                        <FiAward className="mr-1" /> {test.questions?.length || 0} Questions
                                    </span>
                                    <span className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                                        <FiClock className="mr-1" /> {test.duration || 30} Minutes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <FiInfo className="mr-2 text-blue-300" /> Instructions
                            </h2>
                            <ul className="space-y-3 text-blue-100">
                                <li className="flex items-start">
                                    <span className="text-blue-300 mr-2 mt-1">
                                        <FiCheckCircle />
                                    </span>
                                    <span>Read each question carefully before answering.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-300 mr-2 mt-1">
                                        <FiNavigation />
                                    </span>
                                    <span>You can navigate between questions using the question palette.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-300 mr-2 mt-1">
                                        <FiAlertCircle />
                                    </span>
                                    <span>There is no negative marking for wrong answers.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-300 mr-2 mt-1">
                                        <FiClock />
                                    </span>
                                    <span>The timer will start as soon as you begin the test.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-300 mr-2 mt-1">
                                        <FiWifi />
                                    </span>
                                    <span>Ensure you have a stable internet connection throughout the test.</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="flex justify-center">
                            <button
                                onClick={handleStartTest}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                            >
                                <FiPlay className="mr-2" /> Start Test Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { attempted, unattempted } = calculateAttemptStats();
    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-navy-900 text-white">
            {/* Test Header */}
            <div className="bg-gradient-to-r from-blue-800 to-navy-900 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                        <div>
                            <h1 className="text-xl text-white font-semibold">{test.testName}</h1>
                            <p className="text-sm text-blue-200">{test.subjects}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                                <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                                <span className="text-sm">Attempted: {attempted}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                                <span className="h-3 w-3 rounded-full bg-white/30"></span>
                                <span className="text-sm">Unattempted: {unattempted}</span>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-full font-medium flex items-center">
                                <FiClock className="mr-2 text-blue-300" /> 
                                <span>Time Left: {formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Question Area (70% width) */}
                    <div className="lg:w-[70%] bg-white/5 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6">
                        <div className="flex items-start mb-6">
                            <span className="bg-blue-600 text-white font-medium rounded-lg h-8 w-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                {currentQuestionIndex + 1}
                            </span>
                            <div className="w-full">
                                <h3 className="text-lg font-medium text-white mb-6">{currentQuestion.question}</h3>
                                <div className="space-y-4">
                                    {currentQuestion.options.map((option, oIndex) => (
                                        <div 
                                            key={oIndex} 
                                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                answers[currentQuestionIndex] === oIndex 
                                                    ? 'border-blue-400 bg-blue-500/20 shadow-md' 
                                                    : 'border-white/20 hover:border-blue-300 hover:bg-white/10'
                                            }`}
                                            onClick={() => handleAnswerSelect(currentQuestionIndex, oIndex)}
                                        >
                                            <div className="flex items-center">
                                                <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                                                    answers[currentQuestionIndex] === oIndex 
                                                        ? 'border-blue-400 bg-blue-500' 
                                                        : 'border-white/30'
                                                }`}>
                                                    {answers[currentQuestionIndex] === oIndex && (
                                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-white/90">{option}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                            <button
                                onClick={handlePrevQuestion}
                                disabled={currentQuestionIndex === 0}
                                className={`px-6 py-2 rounded-lg flex items-center ${
                                    currentQuestionIndex === 0 
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                <FiChevronLeft className="mr-1" /> Back
                            </button>
                            
                            {currentQuestionIndex < test.questions.length - 1 ? (
                                <button
                                    onClick={handleNextQuestion}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center shadow-md"
                                >
                                    Next <FiChevronRight className="ml-1" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitTest}
                                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center shadow-md"
                                >
                                    Submit <FiSend className="ml-1" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Question Navigation (30% width) */}
                    <div className="lg:w-[30%] bg-white/5 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6">
                        <h3 className="font-medium text-white mb-4 flex items-center">
                            <FiNavigation className="mr-2 text-blue-300" /> Question Palette
                        </h3>
                        <div className="grid grid-cols-5 gap-3">
                            {test.questions?.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionNavClick(index)}
                                    className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-all ${
                                        index === currentQuestionIndex 
                                            ? 'border-blue-400 bg-blue-500 text-white shadow-md' 
                                            : answers[index] !== null 
                                                ? 'border-emerald-400 bg-emerald-500/20 text-white' 
                                                : 'border-white/20 hover:border-blue-300 hover:bg-white/10'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="font-medium text-white mb-4 flex items-center">
                                <FiBarChart2 className="mr-2 text-blue-300" /> Progress Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white/80">Total Questions</span>
                                    <span className="text-sm font-medium">{test.questions.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white/80">Attempted</span>
                                    <span className="text-sm font-medium text-emerald-400">{attempted}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white/80">Unattempted</span>
                                    <span className="text-sm font-medium">{unattempted}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" 
                                        style={{ width: `${(attempted / test.questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="font-medium text-white mb-3 flex items-center">
                                <FiHelpCircle className="mr-2 text-blue-300" /> Legend
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="h-4 w-4 rounded border border-blue-400 bg-blue-500 mr-3"></div>
                                    <span className="text-sm text-white/80">Current Question</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-4 w-4 rounded border border-emerald-400 bg-emerald-500/20 mr-3"></div>
                                    <span className="text-sm text-white/80">Attempted</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-4 w-4 rounded border border-white/20 mr-3"></div>
                                    <span className="text-sm text-white/80">Unattempted</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleSubmitTest}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center justify-center shadow-md"
                            >
                                <FiSend className="mr-2" /> Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestStart;