import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FiYoutube, FiBook, FiLayers, FiList, FiArrowLeft, FiX } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const HomeYoutube = () => {
    const router = useRouter();
    const { classLevel, subject, chapter } = router.query;
    
    const [lecture, setLecture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchlecture = async () => {
            if (!classLevel || !subject || !chapter) return;
            
            try {
                const db = firebase.firestore();
                const lectureRef = collection(db, 'sengarcarrerlectures');
                const q = query(
                    lectureRef,
                    where('class', '==', classLevel),
                    where('subject', '==', subject),
                    where('chapter', '==', chapter)
                );
                
                const querySnapshot = await getDocs(q);
                const lectureData = [];
                querySnapshot.forEach((doc) => {
                    lectureData.push({ id: doc.id, ...doc.data() });
                });
                
                setLecture(lectureData);
            } catch (error) {
                console.error('Error fetching lecture:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchlecture();
    }, [classLevel, subject, chapter]);

    const extractVideoId = (url) => {
        // Handle both full URL and shortened URL
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleVideoClick = (topic) => {
        const videoId = extractVideoId(topic.url);
        if (videoId) {
            setSelectedVideo(videoId);
            setShowModal(true);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-lg text-gray-600">Loading lecture materials...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            {/* Video Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            <FiX size={24} />
                        </button>
                        <div className="aspect-w-16 aspect-h-9 w-full">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-96 rounded-t-lg"
                                title="YouTube video player"
                            ></iframe>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">
                                {lecture[0]?.topics?.find(t => extractVideoId(t.url) === selectedVideo)?.name || 'YouTube Video'}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header with back button */}
                <div className="flex items-center mb-8">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center text-blue-600 text-3xl font-bold hover:text-blue-800 transition-colors mr-4"
                    >
                        <FiArrowLeft className="mr-2" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Lecture Materials</h1>
                </div>

                {/* Course Info Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all hover:shadow-lg">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <FiBook className="text-blue-500 mr-2" />
                                    <span className="text-sm font-semibold text-blue-600">{classLevel}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{subject}</h2>
                                <div className="flex items-center">
                                    <FiLayers className="text-gray-500 mr-2" />
                                    <span className="text-gray-600">{chapter}</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FaChalkboardTeacher className="text-blue-600 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Topics</p>
                                    <p className="text-xl font-bold text-gray-800">{lecture[0]?.topics?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics List */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <FiList className="text-gray-500 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-700">Topics</h3>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {lecture[0]?.topics?.map((topic, index) => {
                            const videoId = extractVideoId(topic.url);
                            return (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md"
                                >
                                    
                                    {videoId && (
                                        <div className="relative pb-[56.25%] bg-black">
                                            <img 
                                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                                                alt={topic.name}
                                                className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-70 cursor-pointer"
                                                onClick={() => handleVideoClick(topic)}
                                            />
                                            <div  onClick={() => handleVideoClick(topic)} className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 cursor-pointer">
                                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between">
                                        <button
                                            onClick={() => handleVideoClick(topic)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                                        >
                                            Watch Now <FiYoutube className="ml-2" />
                                        </button>
                                        <a
                                            href={topic.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center transition-colors"
                                        >
                                            Open in YouTube
                                        </a>
                                    </div> */}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Empty State */}
                {lecture.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiBook className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No lectures found</h3>
                        <p className="text-gray-500">We couldn't find any lectures for this chapter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomeYoutube;