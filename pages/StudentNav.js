import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiHome, FiYoutube, FiFileText, FiUser } from 'react-icons/fi';
import Link from 'next/link';

const StudentNav = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('');

  // Keep active tab in sync with the router natively
  useEffect(() => {
    if (router.isReady) {
      setActiveTab(router.pathname);
    }
  }, [router.isReady, router.pathname]);

  const tabs = [
    { id: 1, name: 'Dashboard', path: '/Student', icon: <FiHome className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 3, name: 'YouTube', path: '/Student/YouTube', icon: <FiYoutube className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 4, name: 'Tests', path: '/Student/Mytest', icon: <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" /> }, // Shortened name for compact fit
    { id: 5, name: 'Profile', path: '/Student/Profile', icon: <FiUser className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  return (
    // Wrapper: Fixed bottom. Flush on mobile, floats with padding on larger screens.
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-0 sm:pb-6 pointer-events-none px-0 sm:px-4">
      
      {/* The Nav Bar: Glassmorphic background, transforms to rounded pill on Desktop */}
      <div className="bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] sm:shadow-lg sm:border border-slate-200/60 w-full sm:w-auto sm:min-w-[400px] rounded-none sm:rounded-2xl pointer-events-auto transition-all">
        
        <div className="flex justify-around items-center h-14 sm:h-16 px-1 sm:px-2 pb-safe">
          {tabs.map((tab) => {
            // Smart active check: Highlights if exact match OR if we are in a sub-route of that tab (excluding root)
            const isActive = activeTab === tab.path || (tab.path !== '/Student' && activeTab.startsWith(tab.path));
            
            return (
              <Link href={tab.path} key={tab.id} passHref>
                <div
                  className="relative flex flex-col items-center justify-center w-16 sm:w-20 h-full cursor-pointer group"
                  onClick={() => setActiveTab(tab.path)}
                >
                  {/* Animated Background Pill */}
                  <div className={`absolute inset-y-1 inset-x-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-indigo-50/80 scale-100' : 'scale-50 opacity-0 group-hover:scale-100 group-hover:bg-slate-50 group-hover:opacity-100'
                  }`}></div>
                  
                  {/* Icon Container with slight jump animation */}
                  <div className={`relative z-10 transition-all duration-300 mb-0.5 ${
                    isActive ? 'text-indigo-600 -translate-y-0.5' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {tab.icon}
                  </div>
                  
                  {/* Compact Text */}
                  <span className={`relative z-10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive ? 'text-indigo-700' : 'text-slate-500'
                  }`}>
                    {tab.name}
                  </span>
                  
                  {/* Minimal Bottom Indicator Dot */}
                  <div className={`absolute bottom-0 w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-indigo-600 scale-100' : 'bg-transparent scale-0'
                  }`}></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CSS for safe area on newer mobile devices (iPhones with bottom bars) */}
      <style jsx>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default StudentNav;