import Link from "next/link"
import React, { useState, useRef, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { FaBook, FaGraduationCap, FaFileAlt, FaYoutube, FaLayerGroup, FaExternalLinkAlt, FaBars, FaTimes, FaSearch,FaHome,FaBookOpen,FaClipboardList,FaBookmark,FaArrowLeft,FaNewspaper } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';

export default function MobileMenu() {
  
    const [notes, setNotes] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeClass, setActiveClass] = useState(null);
    const [activeSubject, setActiveSubject] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [activeYoutubeMenu, setActiveYoutubeMenu] = useState(false);
    const [activeYoutubeClass, setActiveYoutubeClass] = useState(null);
    const [activeYoutubeSubject, setActiveYoutubeSubject] = useState(null);
    const [activeYoutubeChapter, setActiveYoutubeChapter] = useState(null);

    
    // Fetch lectures from Firestore
    useEffect(() => {
        const fetchLectures = async () => {
          try {
            const db = firebase.firestore();
            const lecturesRef = db.collection('sengarcarrerlectures');
            const snapshot = await lecturesRef.get();
            const lecturesData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setLectures(lecturesData);
          } catch (error) {
            console.error('Error fetching lectures:', error);
          }
        };
    
        fetchLectures();
      }, []);
    
    // Fetch notes from Firestore
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const snapshot = await firebase.firestore().collection('sengarcarrernotes').orderBy('createdAt', 'desc').get();
                const notesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNotes(notesData);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, []);

    // Group notes by class level
    const groupByClassLevel = () => {
        return notes.reduce((acc, note) => {
            if (!acc[note.classLevel]) {
                acc[note.classLevel] = [];
            }
            acc[note.classLevel].push(note);
            return acc;
        }, {});
    };

    // Group notes by subject for a specific class level
    const groupBySubject = (classLevel) => {
        const classNotes = notes.filter(note => note.classLevel === classLevel);
        return classNotes.reduce((acc, note) => {
            if (!acc[note.subject]) {
                acc[note.subject] = [];
            }
            acc[note.subject].push(note);
            return acc;
        }, {});
    };

    // Group notes by publication for a specific subject
    const groupByPublication = (classLevel, subject) => {
        const subjectNotes = notes.filter(note => 
            note.classLevel === classLevel && note.subject === subject
        );
        return subjectNotes.reduce((acc, note) => {
            if (!acc[note.publication]) {
                acc[note.publication] = [];
            }
            acc[note.publication].push(note);
            return acc;
        }, {});
    };
    
    // Group lectures by class
    const groupLecturesByClass = () => {
        return lectures.reduce((acc, lecture) => {
            if (!acc[lecture.class]) {
                acc[lecture.class] = [];
            }
            acc[lecture.class].push(lecture);
            return acc;
        }, {});
    };

    // Group lectures by subject for a specific class
    const groupLecturesBySubject = (classLevel) => {
        const classLectures = lectures.filter(lecture => lecture.class === classLevel);
        return classLectures.reduce((acc, lecture) => {
            if (!acc[lecture.subject]) {
                acc[lecture.subject] = [];
            }
            acc[lecture.subject].push(lecture);
            return acc;
        }, {});
    };

    const classGroups = groupByClassLevel();
    const lectureClassGroups = groupLecturesByClass();

    return (
        <ul className="flex flex-col space-y-1">
        <li>
          <a href="/" className="flex items-center py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 text-lg font-medium group">
            <FaHome className="mr-3 text-blue-400 opacity-80 group-hover:opacity-100" />
            Home
          </a>
        </li>
        
        {/* Courses Link */}
        <li>
          <a href="/courses" className="flex items-center py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 text-lg font-medium group">
            <FaBookOpen className="mr-3 text-green-400 opacity-80 group-hover:opacity-100" />
            Courses
          </a>
        </li>
        
        {/* Test Series Link */}
        <li>
          <a href="/testseries" className="flex items-center py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 text-lg font-medium group">
            <FaClipboardList className="mr-3 text-purple-400 opacity-80 group-hover:opacity-100" />
            Test Series
          </a>
        </li>
        <div 
                                        className="relative"
                                        onMouseEnter={() => setActiveMenu('study-material')}
                                        onMouseLeave={() => {
                                            setActiveMenu(null);
                                            setActiveClass(null);
                                            setActiveSubject(null);
                                        }}
                                    >
                                      <button className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 text-lg font-medium group">
            <FaBook className="mr-3 text-indigo-400 opacity-80 group-hover:opacity-100" />
            Study Material
            <IoIosArrowForward className={`ml-auto text-xs text-gray-400 transition-transform ${activeMenu === 'study-material' ? 'rotate-90' : ''}`} />
          </button>
                                        
                                        {activeMenu === 'study-material' && (
                                            <div 
                                                className="absolute left-0 w-[300px] bg-white shadow-2xl rounded-lg z-50 border border-gray-200 p-4 grid grid-cols-1 gap-4"
                                                onMouseLeave={() => {
                                                    setActiveClass(null);
                                                    setActiveSubject(null);
                                                }}
                                            >
                                                {/* Class Level Column */}
                                                <div className="space-y-2 border-r border-gray-100 pr-4">
                                                    <h3 className="font-semibold text-gray-500 uppercase text-xs mb-2 flex items-center gap-1">
                                                        <FaGraduationCap className="text-blue-400" />
                                                        Class Level
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {Object.keys(classGroups).map(classLevel => (
                                                            <div
                                                                key={classLevel}
                                                                onMouseEnter={() => setActiveClass(classLevel)}
                                                                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${activeClass === classLevel ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
                                                            >
                                                                <span>{classLevel}</span>
                                                                <IoIosArrowForward className="text-xs text-gray-400" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Subject Column */}
                                                {activeClass && (
                                                    <div className="space-y-2 border-r border-gray-100 pr-4">
                                                        <h3 className="font-semibold text-gray-500 uppercase text-xs mb-2">Subjects</h3>
                                                        <div className="space-y-1">
                                                            {Object.keys(groupBySubject(activeClass)).map(subject => (
                                                                <div
                                                                    key={subject}
                                                                    onMouseEnter={() => setActiveSubject(subject)}
                                                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${activeSubject === subject ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
                                                                >
                                                                    <span>{subject}</span>
                                                                    <IoIosArrowForward className="text-xs text-gray-400" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Publication Column */}
                                                {activeSubject && (
  <div className="space-y-2">
    <h3 className="font-semibold text-gray-500 uppercase text-xs mb-2">
      Publications
    </h3>
    <div className="space-y-1">
      {Object.keys(groupByPublication(activeClass, activeSubject)).map((publication) => (
        <a
          key={publication}
          href={`/homenotes?classLevel=${encodeURIComponent(activeClass)}&subject=${encodeURIComponent(activeSubject)}&publication=${encodeURIComponent(publication)}`}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between hover:bg-blue-50 text-blue-600 hover:bg-gray-50 text-gray-700`}
        >
          <span>{publication}</span>
        </a>
      ))}
    </div>
  </div>
)}

                                                {/* Empty state when nothing is selected */}
                                                {!activeClass && (
                                                    <div className="col-span-2 flex items-center justify-center">
                                                        <div className="text-center p-8">
                                                            <FaGraduationCap className="mx-auto text-3xl text-gray-300 mb-2" />
                                                            <p className="text-gray-500">Hover over a class level to browse materials</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
<div 
                                        className="relative"
                                        onMouseEnter={() => setActiveYoutubeMenu(true)}
                                        onMouseLeave={() => {
                                            setActiveYoutubeMenu(false);
                                            setActiveYoutubeClass(null);
                                            setActiveYoutubeSubject(null);
                                            setActiveYoutubeChapter(null);
                                        }}
                                    >
                                      <button className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 text-lg font-medium group">
            <FaYoutube className="mr-3 text-red-400 opacity-80 group-hover:opacity-100" />
            YouTube Lectures
            <IoIosArrowForward className={`ml-auto text-xs text-gray-400 transition-transform ${activeYoutubeMenu ? 'rotate-90' : ''}`} />
          </button>
                                        {activeYoutubeMenu && (
                                            <div 
                                                className="absolute left-0 w-[300px] bg-white shadow-2xl rounded-lg z-50 border border-gray-200 p-4 grid grid-cols-1 gap-4"
                                                onMouseLeave={() => {
                                                    setActiveYoutubeClass(null);
                                                    setActiveYoutubeSubject(null);
                                                    setActiveYoutubeChapter(null);
                                                }}
                                            >
                                                {/* Class Level Column */}
                                                <div className="space-y-2 border-r border-gray-100 pr-4">
                                                    <h3 className="font-semibold text-gray-500 uppercase text-xs mb-2 flex items-center gap-1">
                                                        <FaGraduationCap className="text-blue-400" />
                                                        Class Level
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {Object.keys(lectureClassGroups).map(classLevel => (
                                                            <div
                                                                key={classLevel}
                                                                onMouseEnter={() => setActiveYoutubeClass(classLevel)}
                                                                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${activeYoutubeClass === classLevel ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
                                                            >
                                                                <span>{classLevel}</span>
                                                                <IoIosArrowForward className="text-xs text-gray-400" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Subject Column */}
                                                {activeYoutubeClass && (
                                                    <div className="space-y-2 border-r border-gray-100 pr-4">
                                                        <h3 className="font-semibold text-gray-500 uppercase text-xs mb-2">Subjects</h3>
                                                        <div className="space-y-1">
                                                            {Object.keys(groupLecturesBySubject(activeYoutubeClass)).map(subject => (
                                                                <div
                                                                    key={subject}
                                                                    onMouseEnter={() => setActiveYoutubeSubject(subject)}
                                                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${activeYoutubeSubject === subject ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
                                                                >
                                                                    <span>{subject}</span>
                                                                    <IoIosArrowForward className="text-xs text-gray-400" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Chapter Column */}
                                                {activeYoutubeSubject && (
                                                    <div className="space-y-2 border-r border-gray-100 pr-4">
                                                        <h3 className="font-semibold text-gray-500 uppercase text-xs mb-2 flex items-center gap-2">
                                                            <FaLayerGroup className="text-purple-500" />
                                                            <span>Chapters</span>
                                                        </h3>
                                                        <div className="space-y-1">
  {lectures
    .filter(lecture => 
      lecture.class === activeYoutubeClass && 
      lecture.subject === activeYoutubeSubject
    )
    .map(lecture => (
      <a
        key={lecture.id}
        href={`/homeyoutube?classLevel=${activeYoutubeClass}&subject=${activeYoutubeSubject}&chapter=${lecture.chapter}`}
        scroll={false} // Disable default scroll
        onClick={() => window.scrollTo(0, 0)}
        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
          activeYoutubeChapter === lecture.id 
            ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-500' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}
        onMouseEnter={() => setActiveYoutubeChapter(lecture.id)}
      >
        <span className="font-medium">{lecture.chapter}</span>
        <FaExternalLinkAlt className="text-xs text-gray-400" />
      </a>
    ))}
</div>
                                                    </div>
                                                )}

                                                {/* Empty state when nothing is selected */}
                                                {!activeYoutubeClass && (
                                                    <div className="col-span-3 flex items-center justify-center">
                                                        <div className="text-center p-8">
                                                            <FaGraduationCap className="mx-auto text-3xl text-gray-300 mb-2" />
                                                            <p className="text-gray-500">Hover over a class level to browse YouTube lectures</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
      
        </ul>
    )
}