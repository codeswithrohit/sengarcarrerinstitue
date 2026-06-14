import Link from "next/link";
import MobileMenu from "../MobileMenu";
import React, { useState, useRef, useEffect } from 'react';
import { firebase } from '../../../Firebase/config';
import {
  FaBook, FaBars, FaTimes, FaUserCircle
} from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import SignIn from '../../../components/SignIn';

export default function Header1({ scroll, isMobileMenu, handleMobileMenu }) {
  const [notes, setNotes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Hover state tracking
  const [hoverState, setHoverState] = useState({
    studyMaterial: false,
    classLevel: null,
    subject: null,
  });
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const snapshot = await firebase.firestore().collection('notes').orderBy('createdAt', 'desc').get();
        const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  // --- DATA GROUPING LOGIC ---
  const groupedByClass = notes.reduce((acc, note) => {
    if (!acc[note.classLevel]) acc[note.classLevel] = [];
    acc[note.classLevel].push(note);
    return acc;
  }, {});

  const subjectsByClass = notes.reduce((acc, note) => {
    if (!acc[note.classLevel]) acc[note.classLevel] = new Set();
    acc[note.classLevel].add(note.subject);
    return acc;
  }, {});

  const publicationsBySubject = notes.reduce((acc, note) => {
    const key = `${note.classLevel}-${note.subject}`;
    if (!acc[key]) acc[key] = new Set();
    acc[key].add(note.publication);
    return acc;
  }, {});

  // --- FORGIVING HOVER HANDLERS ---
  const handleMouseEnter = (type, value = null) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setHoverState(prev => {
      const newState = { ...prev, [type]: value !== null ? value : true };
      
      // If entering Study Material root, clear deep states
      if (type === 'studyMaterial') {
        newState.classLevel = prev.classLevel;
        newState.subject = prev.subject;
      }
      // If entering a Class, clear Subject state
      if (type === 'classLevel') {
        newState.subject = null;
      }
      return newState;
    });
  };

  const handleMouseLeave = (type) => {
    // Add a 150ms delay before closing to allow mouse to travel between adjacent menus
    timeoutRef.current = setTimeout(() => {
      setHoverState(prev => ({
        ...prev,
        [type]: type === 'studyMaterial' ? false : null
      }));
    }, 150);
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scroll ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-1" : "bg-white py-2 border-b border-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={handleMobileMenu} 
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isMobileMenu ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <Link href="/">
                <img src="/logo.jpg" alt="Logo" className="h-8 sm:h-10 w-auto object-contain cursor-pointer transition-transform hover:scale-105" />
              </Link>
            </div>

            {/* Mobile Login Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Login
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-1 lg:ml-8 flex-1 justify-center">
              
              <Link href="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                Home
              </Link>
              <Link href="/about-us" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
               About Us
              </Link>
              {/* --- STUDY MATERIAL MEGA-MENU --- */}
              <div 
                className="relative group" 
                onMouseEnter={() => handleMouseEnter('studyMaterial')} 
                onMouseLeave={() => handleMouseLeave('studyMaterial')}
              >
                <button className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${hoverState.studyMaterial ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                  <FaBook className="text-indigo-400" /> Study Material
                  <IoIosArrowDown className={`transition-transform duration-200 ${hoverState.studyMaterial ? 'rotate-180' : ''}`} />
                </button>
                
                {hoverState.studyMaterial && (
                  <div className="absolute left-0 top-full pt-1 w-56 z-50">
                    <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-visible py-2 animate-in fade-in slide-in-from-top-2 relative">
                      
                      {Object.keys(groupedByClass).length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 text-center">No materials found</div>
                      ) : (
                        Object.keys(groupedByClass).map((classLevel) => (
                          <div 
                            key={classLevel} 
                            className="relative"
                            onMouseEnter={() => handleMouseEnter('classLevel', classLevel)}
                            onMouseLeave={() => handleMouseLeave('classLevel')}
                          >
                            <div className={`px-4 py-2.5 text-sm font-semibold flex justify-between items-center cursor-pointer transition-colors ${hoverState.classLevel === classLevel ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}>
                              {classLevel}
                              <IoIosArrowForward className={hoverState.classLevel === classLevel ? 'text-indigo-600' : 'text-slate-400'} />
                            </div>
                            
                            {/* --- SUBJECT SUB-MENU --- */}
                            {/* Using -right-full to snap it exactly to the edge, removing any gaps */}
                            {hoverState.classLevel === classLevel && (
                              <div className="absolute top-0 -right-full w-56 z-50 pr-2">
                                <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-visible py-2 animate-in fade-in slide-in-from-left-1 relative">
                                  {[...subjectsByClass[classLevel]].map((subject) => (
                                    <div 
                                      key={subject} 
                                      className="relative"
                                      onMouseEnter={() => handleMouseEnter('subject', `${classLevel}-${subject}`)}
                                      onMouseLeave={() => handleMouseLeave('subject')}
                                    >
                                      <div className={`px-4 py-2.5 text-sm font-semibold flex justify-between items-center cursor-pointer transition-colors ${hoverState.subject === `${classLevel}-${subject}` ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}>
                                        {subject}
                                        <IoIosArrowForward className={hoverState.subject === `${classLevel}-${subject}` ? 'text-indigo-600' : 'text-slate-400'} />
                                      </div>
                                      
                                      {/* --- PUBLICATION SUB-MENU --- */}
                                      {hoverState.subject === `${classLevel}-${subject}` && (
                                        <div className="absolute top-0 -right-full w-64 z-50">
                                          <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-left-1 max-h-96 overflow-y-auto custom-scrollbar">
                                            {[...publicationsBySubject[`${classLevel}-${subject}`]].map((publication) => (
                                              <Link 
                                                key={publication}
                                                href={`/homenotes?classLevel=${encodeURIComponent(classLevel)}&subject=${encodeURIComponent(subject)}&publication=${encodeURIComponent(publication)}`}
                                                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                onClick={() => setHoverState({ studyMaterial: false, classLevel: null, subject: null })} // Close on click
                                              >
                                                {publication}
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* --- END MEGA MENU --- */}

            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3 ml-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm shadow-indigo-200 hover:shadow-md flex items-center gap-2"
              >
                <FaUserCircle className="text-lg" /> Login
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* spacer */}
      <div className="h-16"></div>

      {/* --- MOBILE OVERLAY MENU --- */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleMobileMenu}></div>
        <div className={`absolute top-0 left-0 w-[280px] max-w-[80%] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <Link href="/" onClick={handleMobileMenu}>
              <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain" />
            </Link>
            <button onClick={handleMobileMenu} className="p-2 -mr-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
            <MobileMenu /> 
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            <button onClick={() => { setSidebarOpen(true); handleMobileMenu(); }} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm">
              <FaUserCircle className="text-lg" /> Login to Portal
            </button>
          </div>
        </div>
      </div>

      {/* --- SIDEBAR LOGIN MODAL --- */}
      <div className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed top-0 right-0 z-[70] w-full sm:w-[400px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FaUserCircle className="text-lg" />
            </div>
            <h2 className="text-lg font-black text-slate-800">Student Login</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 -mr-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <SignIn />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      `}</style>
    </>
  );
}