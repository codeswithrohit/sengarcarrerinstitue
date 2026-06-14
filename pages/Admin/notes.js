import React, { useState, useRef, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import AdminNav from '@/components/AdminNav';

const Notes = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    classLevel: '',
    subject: '',
    publication: '',
    topics: [{ name: '', file: null }]
  });

  const fileInputRefs = useRef([]);

  // Fetch notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const snapshot = await firebase.firestore().collection('notes').orderBy('createdAt', 'desc').get();
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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'classLevel' || name === 'subject' || name === 'publication') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name.startsWith('topicName')) {
      const updatedTopics = [...formData.topics];
      updatedTopics[index].name = value;
      setFormData(prev => ({ ...prev, topics: updatedTopics }));
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedTopics = [...formData.topics];
    updatedTopics[index].file = file;
    setFormData(prev => ({ ...prev, topics: updatedTopics }));
  };

  const addNewTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, { name: '', file: null }]
    }));
  };

  const removeTopic = (index) => {
    const updatedTopics = [...formData.topics];
    updatedTopics.splice(index, 1);
    setFormData(prev => ({ ...prev, topics: updatedTopics }));
  };

  const resetForm = () => {
    setFormData({
      classLevel: '',
      subject: '',
      publication: '',
      topics: [{ name: '', file: null }]
    });
    setEditingNote(null);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      classLevel: note.classLevel,
      subject: note.subject,
      publication: note.publication || '',
      topics: note.topics.map(topic => ({
        name: topic.name,
        file: null, // We'll keep the existing file unless changed
        url: topic.url // Keep the existing URL
      }))
    });
    setShowModal(true);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        // First delete the files from storage
        const noteToDelete = notes.find(note => note.id === noteId);
        if (noteToDelete) {
          const deletePromises = noteToDelete.topics.map(topic => {
            const fileRef = firebase.storage().refFromURL(topic.url);
            return fileRef.delete();
          });
          
          await Promise.all(deletePromises);
        }

        // Then delete the document from Firestore
        await firebase.firestore().collection('notes').doc(noteId).delete();

        // Update local state
        setNotes(prev => prev.filter(note => note.id !== noteId));
        alert('Note deleted successfully!');
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classLevel || !formData.subject || formData.topics.some(t => !t.name || (!t.file && !t.url))) {
      alert('Please fill all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // For each topic, either keep existing URL or upload new file
      const topicPromises = formData.topics.map(async (topic) => {
        if (topic.file) {
          // Upload new file
          const storageRef = firebase.storage().ref();
          const fileRef = storageRef.child(`notes/${formData.classLevel}/${formData.subject}/${Date.now()}_${topic.file.name}`);
          
          const uploadTask = fileRef.put(topic.file);
          
          return new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prev => (prev + progress) / formData.topics.length);
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                resolve({
                  name: topic.name,
                  url: downloadURL
                });
              }
            );
          });
        } else {
          // Keep existing URL
          return {
            name: topic.name,
            url: topic.url
          };
        }
      });

      const uploadedTopics = await Promise.all(topicPromises);

      if (editingNote) {
        // Update existing note
        await firebase.firestore().collection('notes').doc(editingNote.id).update({
          classLevel: formData.classLevel,
          subject: formData.subject,
          publication: formData.publication,
          topics: uploadedTopics,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update local state
        setNotes(prev => prev.map(note => 
          note.id === editingNote.id ? {
            ...note,
            classLevel: formData.classLevel,
            subject: formData.subject,
            publication: formData.publication,
            topics: uploadedTopics
          } : note
        ));

        alert('Note updated successfully!');
      } else {
        // Create new note
        const docRef = await firebase.firestore().collection('notes').add({
          classLevel: formData.classLevel,
          subject: formData.subject,
          publication: formData.publication,
          topics: uploadedTopics,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update local state
        setNotes(prev => [{
          id: docRef.id,
          classLevel: formData.classLevel,
          subject: formData.subject,
          publication: formData.publication,
          topics: uploadedTopics,
          createdAt: new Date()
        }, ...prev]);

        alert('Notes uploaded successfully!');
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error uploading notes:', error);
      alert('Error uploading notes. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Notes List */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Study Notes</h1>
        
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No notes found. Upload some notes to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{note.classLevel} - {note.subject}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(note)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {note.publication && (
                    <p className="text-sm text-gray-600 mb-3">Publication: {note.publication}</p>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-medium text-gray-700 mb-2">Topics:</h4>
                    <ul className="space-y-2">
                      {note.topics.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <a 
                            href={topic.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {topic.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Notes Button */}
      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Notes
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingNote ? 'Edit Study Notes' : 'Upload Study Notes'}
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUploading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Class Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Level*</label>
                    <select
                      name="classLevel"
                      value={formData.classLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isUploading}
                    >
                      <option value="">Select Class</option>
                      {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                        <option key={grade} value={`Class ${grade}`}>Class {grade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject*</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isUploading}
                    >
                      <option value="">Select Subject</option>
                      <optgroup label="Core Subjects">
                        {['Math', 'English', 'Hindi', 'Science', 'Social Science'].map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Science Stream">
                        {['Physics', 'Chemistry', 'Biology'].map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Publication */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publication</label>
                    <input
                      type="text"
                      name="publication"
                      value={formData.publication}
                      onChange={handleInputChange}
                      placeholder="e.g. NCERT, RS Aggarwal, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      disabled={isUploading}
                    />
                  </div>

                  {/* Topics */}
                  <div className="space-y-4">
                    {formData.topics.map((topic, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Topic {index + 1}*</label>
                          {formData.topics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTopic(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                              disabled={isUploading}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          name={`topicName${index}`}
                          value={topic.name}
                          onChange={(e) => handleInputChange(e, index)}
                          placeholder="Enter topic name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-3"
                          required
                          disabled={isUploading}
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1">PDF File*</label>
                        {topic.url ? (
                          <div className="mb-2">
                            <p className="text-sm text-gray-600 mb-1">Current file: 
                              <a href={topic.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                {topic.name}.pdf
                              </a>
                            </p>
                            <p className="text-xs text-gray-500">Upload a new file to replace the current one</p>
                          </div>
                        ) : null}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, index)}
                          ref={el => fileInputRefs.current[index] = el}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          required={!topic.url}
                          disabled={isUploading}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addNewTopic}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      disabled={isUploading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Another Topic
                    </button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="pt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingNote ? 'Updating...' : 'Uploading...'}
                        </span>
                      ) : (
                        editingNote ? 'Update Notes' : 'Upload Notes'
                      )}
                    </button>
                  </div>
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

export default Notes;