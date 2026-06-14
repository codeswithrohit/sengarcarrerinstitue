import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import AdminNav from '@/components/AdminNav';

const ReactQuill = dynamic(
  () => import('react-quill'),
  { 
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);

const Courses = () => {
  const [showForm, setShowForm] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [saveMode, setSaveMode] = useState('draft');
  const [courseDuration, setCourseDuration] = useState('');
  const [price, setPrice] = useState('');
  const [offerprice, setOfferPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [aboutCourse, setAboutCourse] = useState('');
  const [classMode, setClassMode] = useState('offline');
  const [courseBanner, setCourseBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await firebase.firestore().collection('courses').get();
        const coursesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses: ', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      let bannerUrl = '';
      if (courseBanner) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`course-banners/${Date.now()}_${courseBanner.name}`);
        await fileRef.put(courseBanner);
        bannerUrl = await fileRef.getDownloadURL();
      }

      // Save course data to Firestore
      await firebase.firestore().collection('courses').add({
        courseName,
        selectedClass,
        saveMode,
        price,
        offerprice,
        courseDuration,
        startDate,
        endDate,
        aboutCourse,
        classMode,
        bannerUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: saveMode === 'draft' ? 'draft' : 'published'
      });

      // Refresh courses list
      const snapshot = await firebase.firestore().collection('courses').get();
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);

      // Reset form
      setCourseName('');
      setSelectedClass('');
      setPrice('');
      setOfferPrice('');
      setSelectedClass('');
      setSaveMode('draft');
      setCourseDuration('');
      setStartDate('');
      setEndDate('');
      setAboutCourse('');
      setClassMode('offline');
      setCourseBanner(null);
      setPreviewImage(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding course: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Courses</h1>
      
      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Offer Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loadingCourses ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading courses...</td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No courses found</td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.selectedClass === 'class10' ? 'Class 10' : 
                     course.selectedClass === 'class11' ? 'Class 11' : 'Class 12'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.price}/{course.offerprice} </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.courseDuration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{course.classMode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{course.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                
                    <a  passHref>
                      <button className="text-green-600 hover:text-green-900">
                        Add/View Subjects
                      </button>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Course Button */}
      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 z-50"
      >
        Add Course
      </button>

      {/* Full Screen Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-h-[100vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Course</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Class Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Class</option>
                      <option value="class10">Class 10</option>
                      <option value="class11">Class 11</option>
                      <option value="class12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter Price</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter Offer Price</label>
                    <input
                      type="text"
                      value={offerprice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div> */}

                  {/* Save Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Save Mode</label>
                    <select
                      value={saveMode}
                      onChange={(e) => setSaveMode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                    </select>
                  </div>

                  {/* Course Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Duration</label>
                    <select
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Duration</option>
                      <option value="1year">1 Year</option>
                      <option value="2year">2 Years</option>
                      <option value="3year">3 Years</option>
                      <option value="6months">6 Months</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* About Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Course</label>
                  {typeof window !== 'undefined' && (
                    <ReactQuill
                      theme="snow"
                      value={aboutCourse}
                      onChange={setAboutCourse}
                      className="border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Class Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Mode</label>
                  <select
                    value={classMode}
                    onChange={(e) => setClassMode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Course Banner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Banner</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {previewImage && (
                    <div className="mt-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-auto max-h-48 rounded-md"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <AdminNav/>
    </div>
  );
};

export default Courses;