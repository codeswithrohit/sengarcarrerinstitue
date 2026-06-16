import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FiBook, FiDownload, FiBookOpen, FiAward, FiFileText, FiClock,FiArrowLeft } from 'react-icons/fi';
import { FaChalkboardTeacher, FaBookReader } from 'react-icons/fa';

const Homenotes = () => {
  const router = useRouter();
  const { classLevel, subject, publication } = router.query;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!classLevel || !subject || !publication) return;
      
      try {
        const db = firebase.firestore();
        const notesRef = collection(db, 'sengarcarrernotes');
        const q = query(
          notesRef,
          where('classLevel', '==', classLevel),
          where('subject', '==', subject),
          where('publication', '==', publication)
        );
        
        const querySnapshot = await getDocs(q);
        const notesData = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() });
        });
        
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [classLevel, subject, publication]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-600">Loading study materials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
           <div className="flex items-center mb-8">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center text-blue-600 text-3xl font-bold hover:text-blue-800 transition-colors mr-4"
                    >
                        <FiArrowLeft className="mr-2" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Study Materials</h1>
                </div>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-white p-3 rounded-full shadow-md mb-6">
            <FiBook className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Study Materials
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive resources for your academic success
          </p>
          
          <div className="mt-8 bg-white shadow-xl rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-100 flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaBookReader className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Class Level</h3>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{classLevel}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-100 flex items-start">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FiFileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-800 uppercase tracking-wider">Subject</h3>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{subject}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-100 flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <FaChalkboardTeacher className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-800 uppercase tracking-wider">Publication</h3>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{publication}</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Topics Section */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-12">
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center">
              <FiBookOpen className="h-6 w-6 text-white mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Available Topics
                </h3>
                <p className="mt-1 text-blue-100">
                  Select a topic to access the study materials
                </p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {notes.length > 0 ? (
              notes[0].topics.map((topic, index) => (
                <div key={index} className="px-6 py-5 hover:bg-gray-50 transition duration-200 ease-in-out">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start mb-4 md:mb-0">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{topic.name}</h4>
                        {/* <div className="flex items-center mt-1 text-sm text-gray-500">
                          <FiClock className="mr-1" />
                          <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div> */}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <a 
                        href={topic.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <FiBookOpen className="mr-2" />
                        View Notes
                      </a>
                      {/* <a 
                        href={topic.url} 
                        download
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <FiDownload className="mr-2" />
                        Download
                      </a> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <FiAward className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No topics available</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  We couldn't find any study materials for your current selection. Please check back later or try different filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <div className="flex items-center mb-4">
            <FiAward className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Study Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Active Recall</h4>
              <p className="text-sm text-gray-600">Test yourself frequently to strengthen memory retention.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800 mb-2">Spaced Repetition</h4>
              <p className="text-sm text-gray-600">Review material at increasing intervals for better learning.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-800 mb-2">Pomodoro Technique</h4>
              <p className="text-sm text-gray-600">Study in 25-minute intervals with short breaks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homenotes;