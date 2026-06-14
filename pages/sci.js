import React, { useState } from 'react';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TriSForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
    admissionFor: '',
    targetClass: '',
    Batch: 'Offline',
    Status: 'Pending',
    schoolCoachingPackage: false,
    studyMaterial: false
  });

  const [errors, setErrors] = useState({
    mobileNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      mobileNumber: ''
    };

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'mobileNumber' && value.length > 10) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      await firebase.firestore().collection('enquiries').add({
        ...formData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      toast.success('Enquiry submitted successfully!');
      
      setFormData({
        name: '',
        mobileNumber: '',
        address: '',
        admissionFor: '',
        targetClass: '',
        Batch: 'Offline',
        Status: 'Pending',
        schoolCoachingPackage: false,
        studyMaterial: false
      });
      
    } catch (error) {
      console.error(error);
      toast.error('Error submitting enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent opacity-30"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white z-10">
              <h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Integrated 
                <span className="relative inline-block ml-2">
                  <span className="relative z-10">Education</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600 opacity-60 rounded-full"></span>
                </span>
                Solution
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-8">
                Sengar Career Institute
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-blue-100">Accademic + competitive exam preparation</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-blue-100">Single fee structure for complete academic support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-blue-100">Comprehensive study material included</span>
                </li>
              </ul>
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-blue-800/50 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-blue-200 text-sm">Students Trained</div>
                </div>
                <div className="bg-blue-800/50 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold">150+</div>
                  <div className="text-blue-200 text-sm">Top Rankers</div>
                </div>
                <div className="bg-blue-800/50 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-blue-200 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl border border-blue-200/30">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Sengar Career Institute Admission Form</h2>
                <p className="mt-2 text-blue-200">Begin your integrated learning journey</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-gray-50"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number*</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      id="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-gray-50"
                      required
                      placeholder="Enter 10-digit mobile number"
                    />
                    {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                    <textarea
                      name="address"
                      id="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-gray-50"
                      required
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Selection</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="admissionFor" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Program*
                      </label>
                      <select
                        name="admissionFor"
                        id="admissionFor"
                        value={formData.admissionFor}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-gray-50"
                        required
                      >
                        <option value="">-- Select Program --</option>
                        <option value="Foundation">Foundation Program (Grades 11-12)</option>
                        <option value="Target">Target (JEE/NEET Intensive)</option>
                        <option value="School With Foundation">School + Coaching Integrated</option>
                        <option value="Board Batch">Board Preparation</option>
                      </select>
                    </div>

                    {formData.admissionFor && (
                      <div>
                        <label htmlFor="targetClass" className="block text-sm font-medium text-gray-700 mb-1">
                          Class/Course Selection*
                        </label>
                        <select
                          name="targetClass"
                          id="targetClass"
                          value={formData.targetClass}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-gray-50"
                          required
                        >
                          <option value="">-- Select Class --</option>
                          {formData.admissionFor === 'Target' && (
                            <>
                              <option value="Target 12th+ NEET">12th+ NEET (Medical Entrance)</option>
                              <option value="Target 12th+ IIT JEE">12th+ IIT JEE (Engineering Entrance)</option>
                            </>
                          )}
                          {formData.admissionFor === 'Foundation' && (
                            <>
                              <option value="Foundation 11th NEET">11th NEET (Medical Entrance)</option>
                              <option value="Foundation 11th IIT JEE">11th IIT JEE (Engineering Entrance)</option>
                              <option value="Foundation 12th NEET">12th NEET (Medical Entrance)</option>
                              <option value="Foundation 12th IIT JEE">12th IIT JEE (Engineering Entrance)</option>
                            </>
                          )}
                          {formData.admissionFor === 'School With Foundation' && (
                            <>
                              <option value="School With Foundation 9th">9th Standard (CBSE/ICSE)</option>
                              <option value="School With Foundation 10th">10th Standard (CBSE/ICSE)</option>
                              <option value="School With Foundation 11th Math">11th Science (Math - CBSE/ISC)</option>
                              <option value="School With Foundation 11th Bio">11th Science (Biology - CBSE/ISC)</option>
                              <option value="School With Foundation 12th Bio">12th Science (Biology - CBSE/ISC)</option>
                              <option value="School With Foundation 12th Math">12th Science (Math - CBSE/ISC)</option>
                            </>
                          )}
                          {formData.admissionFor === 'Board Batch' && (
                            <>
                              <option value="Board Batch 9th">9th Standard</option>
                              <option value="Board Batch 10th">10th Standard</option>
                              <option value="Board Batch 11th Math">11th Science (Math)</option>
                              <option value="Board Batch 11th Bio">11th Science (Biology)</option>
                              <option value="Board Batch 12th Bio">12th Science (Biology)</option>
                              <option value="Board Batch 12th Math">12th Science (Math)</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Options */}
                {/* <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="schoolCoachingPackage"
                      name="schoolCoachingPackage"
                      checked={formData.schoolCoachingPackage}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="schoolCoachingPackage" className="ml-2 block text-sm text-gray-700">
                      I'm interested in the School + Coaching integrated package (Single fee structure)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="studyMaterial"
                      name="studyMaterial"
                      checked={formData.studyMaterial}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="studyMaterial" className="ml-2 block text-sm text-gray-700">
                      Include comprehensive study material (Printed books + Digital access)
                    </label>
                  </div>
                </div> */}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Submit Application'}
                  </button>
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    By submitting, you agree to our terms and privacy policy
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Integrated Education Model</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Combining school curriculum with competitive exam preparation for holistic development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Single Fee Structure</h3>
              <p className="text-gray-600">
                Pay one comprehensive fee that covers both school curriculum and competitive coaching, eliminating multiple payments.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unified Study Material</h3>
              <p className="text-gray-600">
                Specially designed books that cover both board syllabus and competitive exam requirements in an integrated manner.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time-Saving Schedule</h3>
              <p className="text-gray-600">
                Optimized timetable that covers school subjects and competitive prep without overburdening students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Integrated Program Packages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive pricing for school + coaching combined programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-center">
                <h3 className="text-xl font-bold text-white">Class 9-10 Package</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-4xl font-bold text-white">₹25,000</span>
                  <span className="text-blue-200 self-end mb-1">/year</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>CBSE/ICSE School Syllabus</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>NTSE/Foundation Preparation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>4 Classes per week</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Printed Study Material</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button className="w-full py-2 px-4 border border-blue-600 rounded-md text-blue-700 font-medium hover:bg-blue-50 transition">
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-500 transform scale-105 z-10">
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-6 text-center">
                <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 font-bold px-3 py-1 text-xs transform translate-x-2 -translate-y-2 rotate-12">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold text-white">Class 11-12 (Science)</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-4xl font-bold text-white">₹45,000</span>
                  <span className="text-blue-200 self-end mb-1">/year</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>CBSE/ISC School Syllabus</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>JEE/NEET Preparation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>6 Classes per week</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Printed + Digital Material</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Weekly Tests & Analysis</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-md text-white font-medium hover:from-blue-800 hover:to-blue-900 transition">
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-center">
                <h3 className="text-xl font-bold text-white">Target (JEE/NEET)</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-4xl font-bold text-white">₹35,000</span>
                  <span className="text-blue-200 self-end mb-1">/year</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Intensive JEE/NEET Prep</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>5 Days a Week Classes</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Complete Study Material</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Mock Test Series</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button className="w-full py-2 px-4 border border-blue-600 rounded-md text-blue-700 font-medium hover:bg-blue-50 transition">
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              All packages include regular parent-teacher meetings and progress reports
            </p>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our students who benefited from our integrated approach
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-800 font-bold">AP</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Akshay Pratap Singh</h4>
                  <p className="text-sm text-gray-500">IIT Kanpur | School + JEE Program</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The integrated program helped me manage both board exams and JEE preparation without stress. The single fee structure was a big relief for my parents."
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-800 font-bold">PM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pradeepti Mishra</h4>
                  <p className="text-sm text-gray-500">MBBS - KGMU | School + NEET Program</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Sengar Career Institute combined approach meant I didn't have to juggle between different coaching centers. Everything was under one roof with coordinated study plans."
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-800 font-bold">AM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Abhishek Mishra</h4>
                  <p className="text-sm text-gray-500">CBSE 12th - 96% | JEE Mains - 95%ile</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The study material perfectly bridged the gap between board syllabus and JEE requirements. Saved me time and effort in combining resources."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready for Integrated Learning?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Limited seats available for 2024-25 academic year. Enroll now to secure your spot in our school + coaching program.
          </p>
          <a 
            href="#form" 
            className="inline-block bg-white text-blue-800 font-medium py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Apply Now
          </a>
        </div>
      </section>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  )
}

export default TriSForm;