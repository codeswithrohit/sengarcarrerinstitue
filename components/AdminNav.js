import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, 
  FiBook, 
  FiDollarSign, 
  FiFileText, 
  FiYoutube, 
  FiUsers 
} from 'react-icons/fi';
import { FaNoteSticky, FaPersonCircleQuestion } from "react-icons/fa6";

const AdminSideNav = () => {
  const router = useRouter();
  
  const tabs = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: <FiHome className="w-5 h-5" />, 
      path: '/Admin' 
    },
    { 
      id: 'courses', 
      name: 'Courses', 
      icon: <FiBook className="w-5 h-5" />, 
      path: '/Admin/Courses' 
    },
    { 
      id: 'fees', 
      name: 'Fees', 
      icon: <FiDollarSign className="w-5 h-5" />, 
      path: '/Admin/Fees' 
    },
    { 
      id: 'testseries', 
      name: 'Test Series', 
      icon: <FaNoteSticky className="w-5 h-5" />, 
      path: '/Admin/TestSeries' 
    },
    { 
      id: 'notes', 
      name: 'Notes', 
      icon: <FiFileText className="w-5 h-5" />, 
      path: '/Admin/notes' 
    },
    { 
      id: 'youtube', 
      name: 'You Tube', 
      icon: <FiYoutube className="w-5 h-5" />, 
      path: '/Admin/YouTube' 
    },
    { 
      id: 'enquiry', 
      name: 'Enquiry', 
      icon: <FaPersonCircleQuestion className="w-5 h-5" />, 
      path: '/Admin/Enquiry' 
    },
    { 
      id: 'students', 
      name: 'Students', 
      icon: <FiUsers className="w-5 h-5" />, 
      path: '/Admin/Students' 
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl flex flex-col z-20">
      
      {/* Optional: Add a Logo or Dashboard Title at the top */}
      <div className="flex items-center justify-center h-20 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-1 py-6 overflow-y-auto space-y-1">
        {tabs.map((tab) => (
          <Link 
            key={tab.id}
            href={tab.path}
            className={`flex items-center w-full px-6 py-3 transition-colors duration-200 ${
              router.pathname === tab.path 
                ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-500'
            }`}
          >
            <div className="mr-4">
              {tab.icon}
            </div>
            <span className="text-base font-medium">{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSideNav;