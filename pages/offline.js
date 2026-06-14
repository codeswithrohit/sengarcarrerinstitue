import React, { useState, useRef, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OfflineTabbed = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'personal', label: 'Personal', shortLabel: 'Personal', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'academic', label: 'Academic', shortLabel: 'Academic', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { id: 'parents', label: 'Family', shortLabel: 'Family', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'review', label: 'Review', shortLabel: 'Review', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const [formData, setFormData] = useState({
    name: '', email: '', dob: '', admissionFor: '', targetClass: '', currentClass: '',
    subjects: [], board: '', Batch: 'Offline', Status: 'Pending', bloodGroup: '',
    aadharNumber: '', gender: '', mobileNumber: '', fatherName: '', fatherOccupation: '',
    fatherMobile: '', currentSchool: '', previousSchool: '', previousClass: '',
    previousResult: '', postalAddress: '', postalPincode: '', permanentAddress: '',
    permanentPincode: '', declaration: false, photoURL: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const generatePassword = () => {
    if (!formData.dob) return '';
    const [year, month, day] = formData.dob.split('-');
    const yy = year.slice(-2); 
    return `${day}${month}${yy}`;
  };

  const generateUserId = () => {
    const namePart = (formData.name || 'USER').replace(/\s+/g, '').substring(0, 4).toUpperCase();
    let dayPart = '00';
    if (formData.dob) {
      const parts = formData.dob.split('-');
      if (parts.length === 3) {
        dayPart = parts[2];
      }
    }
    const randomDigits = Math.floor(100 + Math.random() * 900); 
    return `${namePart}${dayPart}${randomDigits}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'mobileNumber' && value.length > 10) return;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    try {
      setIsSubmitting(true);
      const storageRef = firebase.storage().ref(`student_photos/${Date.now()}_${file.name}`);
      await storageRef.put(file);
      const downloadURL = await storageRef.getDownloadURL();
      setFormData(prev => ({ ...prev, photoURL: downloadURL }));
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading photo');
      setPreviewUrl(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const validateForm = () => {
    if (!formData.name  || !formData.mobileNumber || !formData.dob) {
      toast.error("Personal Details are incomplete.");
      setActiveTab('personal'); return false;
    }
    if (!formData.admissionFor || !formData.currentSchool) {
      toast.error("Academic Details are incomplete.");
      setActiveTab('academic'); return false;
    }
    if (!formData.fatherName || !formData.fatherMobile || !formData.postalAddress || !formData.postalPincode) {
      toast.error("Family & Address Details are incomplete.");
      setActiveTab('parents'); return false;
    }
    return true;
  };

  const sendWhatsAppMessage = (generatedUserId, generatedEmail, password) => {
    let phone = formData.fatherMobile.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const message = `*Sengar Carrer Institute - Admission Successful* 🎓\n\n` +
      `Dear ${formData.fatherName},\n` +
      `The admission form for *${formData.name}* has been successfully submitted.\n\n` +
      `*📋 Personal Details:*\n` +
      `• Name: ${formData.name}\n` +
      `• DOB: ${formData.dob}\n` +
      `• Mobile: ${formData.mobileNumber}\n` +
      `• Personal Email: ${formData.email}\n` +
      `• Blood Group: ${formData.bloodGroup || 'N/A'}\n\n` +
      `*🏫 Academic Details:*\n` +
      `• Program: ${formData.admissionFor}\n` +
      `• Target Class: ${formData.targetClass || 'N/A'}\n` +
      `• Current School: ${formData.currentSchool}\n\n` +
      `*🔐 Student Portal Access:*\n` +
      `• *Login Email:* ${generatedEmail}\n` +
      `• *Password:* ${password}\n\n` +
      `*👉 Login Here:* https://sengarcareerinstitute.com/\n\n` +
      `Thank you for choosing Sengar Carrer Institute!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!formData.declaration) { toast.warning('Please accept the declaration'); return; }

    try {
      setIsSubmitting(true);
      const password = generatePassword();
      const generatedUserId = generateUserId();
      const generatedEmail = `${generatedUserId.toLowerCase()}.sci@gmail.com`;
      
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(generatedEmail, password);
      
      await firebase.firestore().collection('admissions').doc(userCredential.user.uid).set({
        ...formData,
        studentid: generatedUserId,
        portalLoginEmail: generatedEmail,
        password:password,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: userCredential.user.uid
      });

      toast.success('Admission form submitted successfully!');
      sendWhatsAppMessage(generatedUserId, generatedEmail, password);
      
      setFormData({
        name: '', email: '', dob: '', admissionFor: '', targetClass: '', currentClass: '',
        subjects: [], board: '', bloodGroup: '', aadharNumber: '', gender: '', mobileNumber: '',
        fatherName: '', fatherOccupation: '', fatherMobile: '', currentSchool: '', previousSchool: '',
        previousClass: '', previousResult: '', postalAddress: '', postalPincode: '',
        permanentAddress: '', permanentPincode: '', declaration: false, photoURL: ''
      });
      setPreviewUrl(null);
      setActiveTab('personal');
    } catch (error) {
      console.log("errormye",error)
      console.error(error);
      if (error.code === 'auth/email-already-in-use') toast.error('This generated ID already exists. Please try again.');
      else toast.error('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced Mobile-Optimized UI Classes
  const inputClass = "w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 h-10 sm:py-3 sm:px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none hover:border-slate-300";
  const labelClass = "mb-1 sm:mb-1.5 block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider";
  const sectionTitleClass = "text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-center";

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
      <div className="flex justify-around items-center px-2 py-1">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            <span className="text-[9px] font-semibold">{tab.shortLabel}</span>
            {activeTab === tab.id && (
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Progress Indicator for Mobile
  const MobileProgress = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const progress = ((currentIndex + 1) / tabs.length) * 100;
    
    return (
      <div className="lg:hidden mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-600">Step {currentIndex + 1} of {tabs.length}</span>
          <span className="text-xs font-semibold text-indigo-600">{tabs[currentIndex].label}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans pb-20 lg:pb-8">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-6 lg:py-8">
        {/* Enhanced Mobile Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center justify-between bg-white p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
                Student Admission
              </h1>
              <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 mt-0.5 hidden sm:block">
                Complete the application for Sengra Carrer institute.
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] sm:text-sm font-bold border border-indigo-100 whitespace-nowrap shadow-sm">
            Session 2026-27
          </div>
        </div>

        <MobileProgress />

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          
          {/* Enhanced Mobile-Friendly Sidebar Navigation */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar bg-white p-2 lg:p-3 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 lg:py-3.5 text-xs lg:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-300 flex-none lg:w-full relative overflow-hidden ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-xl hidden lg:block"></div>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute left-0 right-0 bottom-0 h-1 bg-indigo-600 rounded-t-xl block lg:hidden"></div>
                  )}
                  
                  <svg className={`mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 transition-colors duration-300 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content Area */}
          <div className="flex-grow bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-5 lg:p-8 w-full overflow-hidden">
            <form onSubmit={(e) => e.preventDefault()}>
              
              {/* TAB 1: Personal Info */}
              {activeTab === 'personal' && (
                <div className="animate-fadeIn">
                  <h2 className={sectionTitleClass}>
                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0">1</span>
                    Personal Information
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
                    {/* Enhanced Photo Upload */}
                    {/* <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <label className={`${labelClass} text-center sm:text-left`}>Student Photo</label>
                      <div onClick={() => fileInputRef.current.click()} className="mt-1 sm:mt-2 h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-xl sm:rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group shadow-sm">
                        {previewUrl ? (
                          <>
                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-[10px] sm:text-xs font-bold">Change</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className="bg-white p-1.5 sm:p-2 rounded-full shadow-sm mb-1 sm:mb-2 mx-auto w-min">
                              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            </div>
                            <span className="block text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Upload</span>
                          </div>
                        )}
                      </div>
                      <input id="photo" type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div> */}

                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Enter Name" required />
                      </div>
                      <div>
                        <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                        <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className={inputClass} placeholder="10-digit number" required />
                      </div>
                      <div>
                        <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 bg-slate-50 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-slate-100">
                    <div>
                      <label className={labelClass}>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Blood Group</label>
                      <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
                        <option value="">-- Select --</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className={labelClass}>Aadhar Number</label>
                      <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className={inputClass} placeholder="12-digit Number" />
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('academic')} 
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-indigo-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 sm:hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-600/20 text-center"
                    >
                      Next: Academic Details →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Academic Details */}
              {activeTab === 'academic' && (
                <div className="animate-fadeIn">
                  <h2 className={sectionTitleClass}>
                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0">2</span>
                    Academic Details
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8 bg-indigo-50/50 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-indigo-100">
                    <div>
                      <label className={labelClass}>Program Applying For <span className="text-red-500">*</span></label>
                      <select name="admissionFor" value={formData.admissionFor} onChange={handleChange} className={inputClass} required>
                        <option value="">-- Select Program --</option>
                        <option value="Pre Foundation">Pre Foundation Program</option>
                        <option value="Foundation">Foundation Program</option>
                        <option value="Target">Target (12th+)</option>
                        {/* <option value="School With Foundation">School With Foundation</option> */}
                        <option value="Board Batch">Board Batch</option>
                      </select>
                    </div>

                    {formData.admissionFor && (
                      <div className="animate-fadeIn">
                        <label className={labelClass}>Target Course/Class <span className="text-red-500">*</span></label>
                        <select name="targetClass" value={formData.targetClass} onChange={handleChange} className={inputClass} required>
                          <option value="">-- Select Class --</option>
                          {formData.admissionFor === 'Pre Foundation' && (<><option value="8th">8th</option><option value="9th">9th</option><option value="10th">10th</option></>)}
                          {formData.admissionFor === 'Target' && (<><option value="Target 12th+ NEET">12th+ NEET</option><option value="Target 12th+ IIT JEE">12th+ IIT JEE</option></>)}
                          {formData.admissionFor === 'Foundation' && (<><option value="Foundation 11th NEET">11th NEET</option><option value="Foundation 11th IIT JEE">11th IIT JEE</option><option value="Foundation 12th NEET">12th NEET</option><option value="Foundation 12th IIT JEE">12th IIT JEE</option></>)}
                          {['School With Foundation', 'Board Batch'].includes(formData.admissionFor) && (<><option value={`${formData.admissionFor} 9th`}>9th</option><option value={`${formData.admissionFor} 10th`}>10th</option><option value={`${formData.admissionFor} 11th Math`}>11th Math</option><option value={`${formData.admissionFor} 11th Bio`}>11th Bio</option><option value={`${formData.admissionFor} 12th Math`}>12th Math</option><option value={`${formData.admissionFor} 12th Bio`}>12th Bio</option></>)}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Current School Name <span className="text-red-500">*</span></label>
                      <input type="text" name="currentSchool" value={formData.currentSchool} onChange={handleChange} className={inputClass} required placeholder="Full school name" />
                    </div>
                    <div>
                      <label className={labelClass}>Previous School</label>
                      <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} className={inputClass} placeholder="If applicable" />
                    </div>
                    <div>
                      <label className={labelClass}>Prev. Class</label>
                      <input type="text" name="previousClass" value={formData.previousClass} onChange={handleChange} className={inputClass} placeholder="e.g. 10th" />
                    </div>
                    <div>
                      <label className={labelClass}>Result (%)</label>
                      <input type="text" name="previousResult" value={formData.previousResult} onChange={handleChange} className={inputClass} placeholder="E.g. 85%" />
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('personal')} 
                      className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-slate-600 text-sm sm:text-base font-bold border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors text-center order-2 sm:order-1"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('parents')} 
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-indigo-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 sm:hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-600/20 text-center order-1 sm:order-2"
                    >
                      Next: Family Info →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Parents & Address */}
              {activeTab === 'parents' && (
                <div className="animate-fadeIn">
                  <h2 className={sectionTitleClass}>
                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0">3</span>
                    Family & Address Info
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-6 lg:mb-8">
                    <div>
                      <label className={labelClass}>Father's Name <span className="text-red-500">*</span></label>
                      <input type="text" name="fatherName" placeholder='Enter Father Name' value={formData.fatherName} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Occupation</label>
                      <input type="text" name="fatherOccupation" value={formData.fatherOccupation} placeholder='Enter Father Occupation' onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className={labelClass}>WhatsApp Mobile No. <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-medium text-xs sm:text-sm">+91</span>
                        <input type="tel" name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} className={`${inputClass} pl-11 sm:pl-12`} required placeholder="10-digit number" />
                      </div>
                    </div>
                  </div>
               
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 border-t border-slate-100 pt-4 sm:pt-6 lg:pt-8">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className={labelClass}>Postal Address <span className="text-red-500">*</span></label>
                        <textarea name="postalAddress" rows={3} value={formData.postalAddress} onChange={handleChange} className={inputClass} required placeholder="Full street address"></textarea>
                      </div>
                      <div>
                        <label className={labelClass}>PIN Code <span className="text-red-500">*</span></label>
                        <input type="text" placeholder='Pin Code' name="postalPincode" value={formData.postalPincode} onChange={handleChange} className={inputClass} required />
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <label className={labelClass}>Permanent Address <span className="text-red-500">*</span></label>
                        <label className="flex items-center text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg cursor-pointer hover:bg-indigo-100 active:bg-indigo-200 transition-colors w-max">
                          <input type="checkbox" className="mr-1 sm:mr-1.5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" onChange={(e) => {
                            if (e.target.checked) setFormData(prev => ({ ...prev, permanentAddress: prev.postalAddress, permanentPincode: prev.postalPincode }));
                            else setFormData(prev => ({ ...prev, permanentAddress: '', permanentPincode: '' }));
                          }} /> Same as Postal
                        </label>
                      </div>
                      <div>
                        <textarea name="permanentAddress" rows={3} value={formData.permanentAddress} onChange={handleChange} className={inputClass} required placeholder="Permanent location"></textarea>
                      </div>
                      <div>
                        <label className={labelClass}>PIN Code <span className="text-red-500">*</span></label>
                        <input type="text" placeholder='Pin Code' name="permanentPincode" value={formData.permanentPincode} onChange={handleChange} className={inputClass} required />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('academic')} 
                      className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-slate-600 text-sm sm:text-base font-bold border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors text-center order-2 sm:order-1"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('review')} 
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-indigo-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-indigo-700 active:bg-indigo-800 sm:hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-600/20 text-center order-1 sm:order-2"
                    >
                      Review Application →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Review & Submit */}
              {activeTab === 'review' && (
                <div className="animate-fadeIn">
                  <h2 className={sectionTitleClass}>
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0">✓</span>
                    Review Application
                  </h2>
                  
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4 sm:mb-6 lg:mb-8">
                    {/* Review Section 1 */}
                    <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-100">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-[10px] sm:text-xs lg:text-sm font-extrabold text-slate-800 uppercase tracking-wider">Personal Details</h3>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('personal')} 
                          className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 sm:px-3 py-1 rounded-full transition-colors active:bg-indigo-100"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Name</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Mobile</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.mobileNumber || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">DOB</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.dob || '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Section 2 */}
                    <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-[10px] sm:text-xs lg:text-sm font-extrabold text-slate-800 uppercase tracking-wider">Academic Target</h3>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('academic')} 
                          className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 sm:px-3 py-1 rounded-full transition-colors active:bg-indigo-100"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Program</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.admissionFor || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Class</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.targetClass || '—'}</p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Current School</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 break-words">{formData.currentSchool || '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Section 3 */}
                    <div className="p-3 sm:p-4 lg:p-6">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-[10px] sm:text-xs lg:text-sm font-extrabold text-slate-800 uppercase tracking-wider">Family & Contact</h3>
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('parents')} 
                          className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 sm:px-3 py-1 rounded-full transition-colors active:bg-indigo-100"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Father's Info</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formData.fatherName} • {formData.fatherMobile}</p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">Address</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 break-words">{formData.postalAddress}, {formData.postalPincode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 p-3 sm:p-4 lg:p-5 rounded-xl border border-indigo-100 mb-4 sm:mb-5 lg:mb-6">
                    <label className="flex items-start cursor-pointer group">
                      <div className="flex items-center h-4 sm:h-5 mt-0.5 flex-shrink-0">
                        <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                      </div>
                      <span className="ml-2.5 sm:ml-3 text-[10px] sm:text-xs lg:text-sm text-indigo-900 font-medium group-hover:text-indigo-700 transition-colors leading-relaxed">
                        I hereby declare that all the information provided is correct to the best of my knowledge. I understand the rules and regulations of Sengar Carrer Institute.
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-3">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('parents')} 
                      className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-slate-600 text-sm sm:text-base font-bold border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors text-center order-2 sm:order-1"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSubmit} 
                      disabled={isSubmitting || !formData.declaration} 
                      className={`w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 font-bold text-white text-sm sm:text-base rounded-xl transition-all ${
                        isSubmitting || !formData.declaration 
                          ? 'bg-slate-400 cursor-not-allowed opacity-70' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:from-emerald-700 active:to-teal-800 sm:hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20'
                      } text-center flex items-center justify-center order-1 sm:order-2`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Confirm & Submit ✓'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>

      <MobileBottomNav />

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default OfflineTabbed;