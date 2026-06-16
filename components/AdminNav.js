import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import { 
  FiHome, 
  FiBook, 
  FiDollarSign, 
  FiFileText, 
  FiYoutube, 
  FiUsers,
  FiLogOut // Imported Logout icon
} from 'react-icons/fi';
import { FaNoteSticky, FaPersonCircleQuestion } from "react-icons/fa6";

const AdminSideNav = () => {
  const router = useRouter();
  
  // State to hold the current user's name and permissions
  const [adminName, setAdminName] = useState('');
  const [permissions, setPermissions] = useState({
    viewDashboard: false,
    viewFees: false,
    viewTestSeries: false,
    viewYouTube: false,
    viewStudent: false,
    viewAdminUser: false,
    // Add default true for tabs you haven't restricted yet
    viewCourses: true,
    viewNotes: true,
    viewEnquiry: true,
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch live permissions and user details on mount
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const db = firebase.firestore();
          const adminSnapshot = await db.collection('sengarcarreradminUsers')
            .where('email', '==', user.email)
            .get();

          if (!adminSnapshot.empty) {
            const adminData = adminSnapshot.docs[0].data();
            
            // Set the Admin's Name (fallback to email prefix if name doesn't exist)
            setAdminName(adminData.name || user.email.split('@')[0]);

            // Map Firestore permissions to state
            setPermissions({
              viewDashboard: adminData.viewDashboard || false,
              viewFees: adminData.viewFees || false,
              viewTestSeries: adminData.viewTestSeries || false,
              viewYouTube: adminData.viewYouTube || false,
              viewStudent: adminData.viewStudent || false,
              viewAdminUser: adminData.viewAdminUser || false,
              // Keep these true by default unless you added them to your DB schema
              viewCourses: true, 
              viewNotes: true,
              viewEnquiry: true,
            });
          } else {
            // Fallback if user is logged in but not found in adminUsers collection
            setAdminName(user.email.split('@')[0]);
          }
        } catch (error) {
          console.error("Error fetching admin permissions for nav:", error);
        }
      } else {
        // If not logged in, you might want to redirect to login here as well
        router.push('/Admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);
  
  // Handle Logout Function
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      router.push('/Admin/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Define tabs with an added "show" property linked to permissions
  const tabs = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: <FiHome className="w-5 h-5" />, 
      path: '/Admin',
      show: permissions.viewDashboard
    },
    { 
      id: 'courses', 
      name: 'Courses', 
      icon: <FiBook className="w-5 h-5" />, 
      path: '/Admin/Courses',
      show: permissions.viewCourses
    },
    { 
      id: 'fees', 
      name: 'Fees', 
      icon: <FiDollarSign className="w-5 h-5" />, 
      path: '/Admin/Fees',
      show: permissions.viewFees
    },
    { 
      id: 'testseries', 
      name: 'Test Series', 
      icon: <FaNoteSticky className="w-5 h-5" />, 
      path: '/Admin/TestSeries',
      show: permissions.viewTestSeries
    },
    { 
      id: 'notes', 
      name: 'Notes', 
      icon: <FiFileText className="w-5 h-5" />, 
      path: '/Admin/notes',
      show: permissions.viewNotes
    },
    { 
      id: 'youtube', 
      name: 'You Tube', 
      icon: <FiYoutube className="w-5 h-5" />, 
      path: '/Admin/YouTube',
      show: permissions.viewYouTube
    },
    { 
      id: 'enquiry', 
      name: 'Enquiry', 
      icon: <FaPersonCircleQuestion className="w-5 h-5" />, 
      path: '/Admin/Enquiry',
      show: permissions.viewEnquiry
    },
    { 
      id: 'students', 
      name: 'Students', 
      icon: <FiUsers className="w-5 h-5" />, 
      path: '/Admin/Students',
      show: permissions.viewStudent
    },
    { 
      id: 'adminuser', 
      name: 'Admin User', 
      icon: <FiUsers className="w-5 h-5" />, 
      path: '/Admin/AdminUser',
      show: permissions.viewAdminUser
    },
  ];

  // Filter out the tabs the user doesn't have access to
  const visibleTabs = tabs.filter(tab => tab.show);

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl flex flex-col z-20">
      
      {/* Header and Welcome Message */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 bg-gray-50/50">
        <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
        {!loading && adminName && (
          <p className="mt-2 text-sm font-medium text-gray-500">
            Welcome, <span className="text-indigo-600 font-bold capitalize">{adminName}</span>
          </p>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-1 py-4 overflow-y-auto space-y-1">
        {loading ? (
          // Loading Skeleton
          <div className="px-6 space-y-4 animate-pulse mt-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          // Render Authorized Tabs
          visibleTabs.map((tab) => (
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
          ))
        )}
      </div>

      {/* Logout Button at the bottom */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-500 transition-colors duration-200 rounded-xl hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default AdminSideNav;