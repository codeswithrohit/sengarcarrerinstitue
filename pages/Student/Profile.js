import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import StudentNav from '../StudentNav';
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiHome, FiMapPin, 
  FiEdit, FiSave, FiX, FiDroplet, FiLock, FiTarget, FiInfo 
} from 'react-icons/fi';
import { FaUserGraduate, FaAward, FaSchool, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          router.push('/');
          return;
        }

        const doc = await firebase.firestore().collection('sengarcarreradmissions').doc(user.uid).get();
        
        if (!doc.exists) {
          router.push('/');
          return;
        }

        setUserData(doc.data());
        setEditData(doc.data());
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) fetchUserData();
      else router.push('/');
    });

    return () => unsubscribe();
  }, [router]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const user = firebase.auth().currentUser;
      await firebase.firestore().collection('sengarcarreradmissions').doc(user.uid).update({
        ...editData,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });
      setUserData(editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <StudentNav />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-indigo-200 rounded-full mb-3"></div>
            <div className="h-2 w-20 bg-slate-200 rounded mb-2"></div>
            <div className="h-2 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <StudentNav />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-xs font-bold shadow-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // Ultra-Compact Smart Field Renderer
  const renderField = (label, value, icon, name, editable = true, type = "text") => {
    const isEmpty = value === undefined || value === null || value === '';

    if (!isEditing && isEmpty) return null;

    if (isEditing && editable) {
      return (
        <div className="mb-2">
          <label className="block text-[8px] sm:text-[9px] font-black tracking-widest text-slate-400 uppercase mb-0.5">{label}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400 text-xs">
              {icon}
            </div>
            <input
              type={type} name={name} value={editData[name] || ''} onChange={handleEditChange}
              className="w-full pl-7 pr-2 py-1.5 text-[10px] sm:text-xs font-semibold border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50 transition-colors"
              placeholder={`Enter ${label}`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 mb-1.5 bg-slate-50/80 hover:bg-slate-50 p-1.5 sm:p-2 rounded-md border border-slate-100/50 transition-colors">
        <span className="text-indigo-400 text-xs sm:text-sm flex-shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] sm:text-[9px] font-black tracking-widest text-slate-400 uppercase leading-none mb-0.5 truncate">{label}</p>
          <p className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight truncate">
            {isEmpty && !editable ? 'N/A' : value}
          </p>
        </div>
      </div>
    );
  };

  const renderBadge = (label, value, colorClass = "bg-indigo-50 text-indigo-700 border-indigo-100") => (
    <div className="flex flex-col justify-center p-2 bg-white rounded-lg border shadow-sm flex-1 min-w-[120px]">
      <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 truncate">{label}</span>
      <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider border w-max ${colorClass}`}>
        {value || 'N/A'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col pb-8 font-sans text-slate-800">
      <StudentNav />
      
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 md:pt-6">
        
        {/* Compact Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">Student Profile</h1>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">ID: <span className="text-indigo-600">{userData.studentid}</span></p>
          </div>
          
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center px-3 py-1.5 bg-indigo-600 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shrink-0">
              <FiEdit className="mr-1.5" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2 w-full sm:w-auto shrink-0">
              <button onClick={handleCancel} className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                <FiX className="mr-1" /> Cancel
              </button>
              <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                <FiSave className="mr-1" /> Save
              </button>
            </div>
          )}
        </div>

        {/* Dense Status Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {renderBadge("Status", userData.Status, userData.Status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100')}
          {renderBadge("Batch Mode", userData.Batch, "bg-purple-50 text-purple-700 border-purple-100")}
          {renderBadge("Admission For", userData.admissionFor, "bg-blue-50 text-blue-700 border-blue-100")}
          {renderBadge("Target Class", userData.targetClass, "bg-pink-50 text-pink-700 border-pink-100")}
        </div>

        {/* Main Tightly-Packed Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          
          {/* Left Column (4/12): Personal & Account */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-4">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center mb-2 sm:mb-3 pb-2 border-b border-slate-100">
                <FaUserGraduate className="mr-1.5 text-indigo-500" /> Identity
              </h2>
              <div>
                {renderField('Full Name', userData.name, <FiUser />, 'name')}
                {renderField('Gender', userData.gender, <FiUser />, 'gender')}
                {renderField('DOB', userData.dob, <FiCalendar />, 'dob', false, "date")}
                {renderField('Blood Group', userData.bloodGroup, <FiDroplet className="text-rose-400" />, 'bloodGroup')}
                {renderField('Aadhar', userData.aadharNumber, <FaShieldAlt className="text-emerald-500" />, 'aadharNumber')}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center mb-2 sm:mb-3 pb-2 border-b border-slate-100">
                <FiLock className="mr-1.5 text-indigo-500" /> Contact & Access
              </h2>
              <div>
                {renderField('Mobile', userData.mobileNumber, <FiPhone />, 'mobileNumber', false)}
                {renderField('Email', userData.email, <FiMail />, 'email')}
                {renderField('Portal Login', userData.portalLoginEmail, <FiMail />, 'portalLoginEmail', false)}
                {renderField('Password', userData.password, <FiLock />, 'password', true)}
              </div>
            </div>

          </div>

          {/* Right Column (8/12): Academics, Address, Parent, Fees */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-8 min-w-0 mb-10">
            
            {/* Academic Info Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center mb-2 sm:mb-3 pb-2 border-b border-slate-100">
                <FaSchool className="mr-1.5 text-indigo-500" /> Academics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <h3 className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase mb-1.5 mt-1">Current</h3>
                  {renderField('Class', userData.currentClass, <FiBook />, 'currentClass')}
                  {renderField('School', userData.currentSchool, <FaSchool />, 'currentSchool')}
                  {renderField('Board', userData.board, <FiTarget />, 'board')}
                </div>
                <div>
                  <h3 className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase mb-1.5 mt-1 sm:mt-1">Previous</h3>
                  {renderField('Prev Class', userData.previousClass, <FiBook />, 'previousClass')}
                  {renderField('Prev School', userData.previousSchool, <FaSchool />, 'previousSchool')}
                  {renderField('Prev Result (%)', userData.previousResult, <FaAward />, 'previousResult')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Parent Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
                <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center mb-2 sm:mb-3 pb-2 border-b border-slate-100">
                  <FiUser className="mr-1.5 text-indigo-500" /> Guardian
                </h2>
                <div>
                  {renderField('Father Name', userData.fatherName, <FiUser />, 'fatherName')}
                  {renderField('Occupation', userData.fatherOccupation, <FiInfo />, 'fatherOccupation')}
                  {renderField('Mobile/WA', userData.fatherMobile, <FiPhone className="text-emerald-500" />, 'fatherMobile', false)}
                </div>
              </div>

              {/* Address Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
                <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center mb-2 sm:mb-3 pb-2 border-b border-slate-100">
                  <FiHome className="mr-1.5 text-indigo-500" /> Location
                </h2>
                <div>
                  {renderField('Perm. Address', userData.permanentAddress, <FiMapPin />, 'permanentAddress')}
                  {renderField('Perm. Pin', userData.permanentPincode, <FiTarget />, 'permanentPincode')}
                  {renderField('Postal Address', userData.postalAddress, <FiMapPin />, 'postalAddress')}
                  {renderField('Postal Pin', userData.postalPincode, <FiTarget />, 'postalPincode')}
                </div>
              </div>
            </div>

            {/* Compact Fees Section */}
            {userData.fees && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 ">
                <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 border-b border-slate-100">
                  <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center">
                    <FaMoneyBillWave className="mr-1.5 text-indigo-500" /> Fee Structure
                  </h2>
                  <div className="text-right">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase mr-1.5">Total:</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 leading-none">₹{userData.fees.totalFees?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {userData.fees.installments?.map((inst, index) => {
                    const isPaid = inst.paid || inst.paidDate;
                    return (
                      <div key={index} className={`p-2 rounded-lg border flex flex-col justify-between ${isPaid ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-1.5 gap-1">
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-800 truncate leading-tight">{inst.title || `Inst ${inst.number}`}</span>
                          <span className="text-[10px] sm:text-xs font-black text-slate-900 leading-tight">₹{Number(inst.amount).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-end mt-auto gap-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] uppercase font-bold text-slate-500 leading-none">Due: {inst.date ? new Date(inst.date).toLocaleDateString() : 'TBD'}</span>
                            {inst.paidDate && <span className="text-[8px] uppercase font-black text-emerald-600 leading-none">Paid: {new Date(inst.paidDate).toLocaleDateString()}</span>}
                          </div>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                            {isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Profile;