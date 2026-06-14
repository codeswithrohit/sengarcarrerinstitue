import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Background gradient animation
  const backgroundVariants = {
    initial: {
      backgroundPosition: '0% 50%'
    },
    animate: {
      backgroundPosition: '100% 50%',
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }
    }
  };

  return (
    <motion.section 
    className="relative overflow-hidden py-8 md:py-8"
    initial="initial"
    animate="animate"
    variants={backgroundVariants}
    style={{
      background: 'linear-gradient(-45deg, #f3f4f6, #e5e7eb, #f0fdfa, #ecfdf5)',
      backgroundSize: '400% 400%'
    }}
  >
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:80px_80px]"></div>
    </div>
    
    {/* Glow effects */}
    <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-400 rounded-full filter blur-3xl opacity-10"></div>
    <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-400 rounded-full filter blur-3xl opacity-10"></div>
  
    <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Text Content */}
        <motion.div 
          className="w-full lg:w-1/2"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.div variants={item} className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              CBSE + Competitive Exams
            </span>
            <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              JEE | NEET | Commerce
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            variants={item}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Comprehensive</span> Education <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Classes 8-12</span> with Exam Prep
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
            variants={item}
          >
            The ultimate learning program that seamlessly integrates CBSE/State Board curriculum with JEE, NEET, and Commerce exam preparation - saving time, money and maximizing results.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 items-center"
            variants={item}
          >
            <motion.button 
              className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg overflow-hidden group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <a href='/offline'>
                <span className="relative z-10 flex items-center">
                  Join Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
            </motion.button>
            
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/12.jpg" alt="Student" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Student" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/45.jpg" alt="Student" />
              </div>
              <span className="text-sm text-gray-600">1000+ successful students</span>
            </div>
          </motion.div>
        </motion.div>
  
        {/* Right Side - Image */}
        <motion.div 
          className="w-full md:w-1/2 relative px-4 sm:px-0"
          initial="hidden"
          animate="visible"
          variants={slideInRight}
        >
          <div className="relative mb-16">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-lg"></div>
            <motion.div 
              className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-4 sm:border-8 border-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <img 
                src="/banner1.png"
                alt="Students learning"
                className="w-full h-auto object-cover"
              />
            </motion.div>
            
            {/* Floating stats - adjusted for mobile */}
            <motion.div 
              className="absolute -bottom-20 sm:-bottom-16 -left-2 sm:-left-6 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-1 sm:p-2 rounded-md sm:rounded-lg mr-2 sm:mr-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">JEE/NEET Selection</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">92%</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -top-24 sm:top-18 -right-2 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center">
                <div className="bg-emerald-100 p-1 sm:p-2 rounded-md sm:rounded-lg mr-2 sm:mr-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Board Exam Scores</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">95%+ Avg</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.section>
  );
};

export default Hero;