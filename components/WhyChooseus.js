import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const WhyChooseUs = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background with animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative bg-gradient-to-br from-gray-900 via-green-900 to-green-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">Sengar Career Institute</span>?
            </h2>
            <p className="mt-5 max-w-3xl mx-auto text-xl text-green-100 sm:mt-6">
              Premier destination for Academic Excellence (8-12), IIT JEE, NEET, and Commerce
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Card 1 - SCI Approach */}
            <motion.div 
              variants={cardVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400 transition-all duration-300 h-full">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-full">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-white">SCI Methodology</h3>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-yellow-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Concept Mastery:</span> Foundation building with modern pedagogy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-yellow-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Exam Strategy:</span> Specialized approach for each exam pattern</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-yellow-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Result-Oriented:</span> Proven track record of academic success</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Comprehensive Courses */}
            <motion.div 
              variants={cardVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 h-full">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-white">Comprehensive Programs</h3>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Engineering:</span> IIT JEE Main & Advanced programs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Medical:</span> NEET & AIIMS preparation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Commerce:</span> CA/CS foundation with boards</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 - Academic Excellence */}
            <motion.div 
              variants={cardVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 h-full">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-white">Academic Excellence (8-12)</h3>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">CBSE/ICSE:</span> Complete syllabus coverage</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Foundation:</span> Early preparation for competitive exams</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Board Focus:</span> Special attention to scoring patterns</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4 - 24/7 Support */}
            <motion.div 
              variants={cardVariants}
              className="relative group sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-red-400 transition-all duration-300 h-full">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-full">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-white">24/7 Academic Support</h3>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-red-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Doubt Resolution:</span> Instant help from subject experts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-red-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Mentorship:</span> Personalized guidance sessions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-red-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">E-Library:</span> Access to premium study resources</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 5 - Results */}
            <motion.div 
              variants={cardVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 h-full">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-white">Proven Track Record</h3>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Rank Holders:</span> Consistent IIT JEE & NEET qualifiers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Board Excellence:</span> 90%+ marks in CBSE/ICSE</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Commerce Success:</span> CA/CS foundation achievers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 6 - Personalized Learning */}
            <motion.div 
              variants={cardVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-400 transition-all duration-300 h-full">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-full">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-white">Personalized Learning</h3>
                  </div>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-indigo-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Custom Plans:</span> Tailored to individual learning styles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-indigo-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Weakness Analysis:</span> Regular diagnostic tests</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 text-indigo-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="ml-3 text-gray-300"><span className="font-semibold">Remedial Classes:</span> Focused improvement sessions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <button className="relative px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg group">
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <span className="relative flex items-center justify-center space-x-2">
                <span className="text-lg font-bold">Enroll Now - Limited Seats Available!</span>
                <svg className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;