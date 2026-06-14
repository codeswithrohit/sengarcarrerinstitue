import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
const TestSeries = () => {
    const router = useRouter();
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTests = async () => {
            setIsLoading(true);
            try {
                const db = firebase.firestore();
                const querySnapshot = await db.collection('testSeries')
                    .orderBy('createdAt', 'desc')
                    .get();
                const testsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTests(testsData);
            } catch (error) {
                toast.error('Error fetching tests: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchTests();
    }, []);

    const handleStartTest = (testId) => {
        router.push(`/test-start?id=${testId}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl blur-md opacity-75"></div>
                        <h1 className="relative text-4xl font-bold text-white sm:text-5xl mb-4 px-6 py-3">
                            Tris Test Series
                        </h1>
                    </div>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Elevate your preparation with Tris Coaching's premium test series. Practice with timed tests and detailed analytics.
                    </p>
                    <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto border border-gray-700 shadow-lg">
                        <p className="text-blue-400 font-medium text-lg">Why choose Tris Test Series?</p>
                        <p className="text-blue-100 mt-3">
                            Our tests are designed by experts to simulate real exam conditions, with minimum 30 minute durations and comprehensive coverage of all topics.
                        </p>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center">
                                <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-blue-100">Timed Tests</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-blue-100">Accurate Answers</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <span className="text-sm text-blue-100">Performance Analytics</span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="text-sm text-blue-100">Expert Curated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Cards */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {tests.map((test) => (
                            <div 
                                key={test.id} 
                                className="relative group transition-transform duration-300 hover:scale-[1.02]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-2xl opacity-80 group-hover:opacity-100 transition-all duration-300 blur-lg"></div>
                                <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-700 overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                    
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{test.testName || 'Test Name'}</h3>
                                                <p className="text-sm text-blue-300 mt-1">By Tris Coaching</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${test.mode === 'free' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-blue-900/30 text-blue-400 border border-blue-800'}`}>
                                                {test.mode === 'Free' ? 'FREE' : `PAID - ₹${test.fees || 0}`}
                                            </span>
                                        </div>

                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="h-9 w-9 rounded-lg bg-blue-900/30 flex items-center justify-center">
                                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-100">
                                                        <span className="font-medium text-white">Subjects:</span> 
                                                        {typeof test.subjects === 'string' ? test.subjects : 
                                                        (Array.isArray(test.subjects) ? test.subjects.join(', ') : 'Not specified')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="h-9 w-9 rounded-lg bg-blue-900/30 flex items-center justify-center">
                                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-100">
                                                        <span className="font-medium text-white">Questions:</span> {test.questions?.length || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="h-9 w-9 rounded-lg bg-blue-900/30 flex items-center justify-center">
                                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-100">
                                                        <span className="font-medium text-white">Duration:</span> {test.duration || '30 min'} (minimum)
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="h-9 w-9 rounded-lg bg-blue-900/30 flex items-center justify-center">
                                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-100">
                                                        <span className="font-medium text-white">Server:</span> {test.server || 'Tris Test Server'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            {test.mode === 'free' ? (
                                                <button
                                                    onClick={() => handleStartTest(test.id)}
                                                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Start Test
                                                </button>
                                            ) : (
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => handleStartTest(test.id)}
                                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Start Now 
                                                    </button>
                                                    <p className="text-xs text-center text-blue-400">Powered by Tris</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && tests.length === 0 && (
                    <div className="text-center py-16 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-2xl mx-auto p-8 border border-gray-700">
                        <div className="mx-auto h-20 w-20 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                            <svg className="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-white">No tests available yet</h3>
                        <p className="mt-2 text-blue-200">Tris Coaching is preparing new test series for you. Check back soon!</p>
                        <button className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Get Notified
                        </button>
                    </div>
                )}

                {/* About Section */}
                <div className="mt-16 bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm rounded-2xl p-10 border border-gray-700 shadow-xl overflow-hidden">
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 h-40 w-40 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
                        <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
                        
                        <div className="text-center relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">About Tris Test Series</h2>
                            <div className="max-w-3xl mx-auto">
                                <p className="text-blue-100 mb-8 text-lg">
                                    Tris Coaching provides high-quality test series designed by subject matter experts to help you excel in your exams. 
                                    Our tests feature:
                                </p>
                                <ul className="grid gap-6 sm:grid-cols-2 text-left max-w-2xl mx-auto">
                                    <li className="flex items-start">
                                        <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-white">Minimum 30 minute timed tests</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-white">Dedicated test servers</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-white">Detailed performance analytics</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-white">Expert-curated question banks</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSeries;