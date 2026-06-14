import { useEffect, useRef, useState, useCallback } from "react";
import Isotope from "isotope-layout";
import Link from "next/link";

export default function PortfolioFilter1({ courses = [] }) {
    // Isotope
    const isotope = useRef();
    const [filterKey, setFilterKey] = useState("*");

    // Extract unique class names
    const uniqueCategories = Array.from(new Set(courses.map((item) => item.className)));

    useEffect(() => {
        setTimeout(() => {
            isotope.current = new Isotope(".courses-active", {
                itemSelector: ".grid-item",
                percentPosition: true,
                masonry: {
                    columnWidth: ".grid-item",
                },
                animationOptions: {
                    duration: 750,
                    easing: "linear",
                    queue: false,
                },
            });
        }, 1000);
    }, []);

    useEffect(() => {
        if (isotope.current) {
            filterKey === "*"
                ? isotope.current.arrange({ filter: `*` })
                : isotope.current.arrange({ filter: `.${CSS.escape(filterKey)}` });
        }
    }, [filterKey]);

    const handleFilterKeyChange = useCallback((key) => () => {
        setFilterKey(key);
    }, []);

    const activeBtn = (value) => (value === filterKey ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200");

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Header Content */}
                    <div className="space-y-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                            {courses.length}+ Professional Courses
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Explore Our <span className="text-indigo-600">Premium</span> Learning Programs
                        </h2>
                        <p className="text-gray-600 max-w-lg">
                            Hand-picked professional courses to accelerate your career growth and skill development.
                        </p>
                    </div>
                    
                    {/* Filter Buttons - Modern Chip Style */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={handleFilterKeyChange("*")}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center ${activeBtn("*")}`}
                            >
                                All Courses
                                <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">New</span>
                            </button>
                            
                            {uniqueCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={handleFilterKeyChange(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeBtn(category)}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="courses-active grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-72">
                {courses.length > 0 ? (
                    courses.map((item, i) => (
                        <div className={`grid-item ${CSS.escape(item.className)}`} key={i}>
                            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100">
                                {/* Course Thumbnail */}
                                <div className="relative overflow-hidden">
                                    <Link href={`/course/${item.id}`} className="block">
                                        <img 
                                            src={item.bannerUrl} 
                                            alt={item.courseName} 
                                            className="w-96 h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <Link 
                                        href="#" 
                                        className="absolute top-4 right-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm hover:bg-indigo-600 hover:text-white transition-colors"
                                    >
                                        {item.className}
                                    </Link>
                                </div>

                                {/* Course Content */}
                                <div className="p-6">
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {item.classMode}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(item.startDate.split('/').reverse().join('-')).toLocaleDateString()} - {new Date(item.endDate.split('/').reverse().join('-')).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <h3 className="mt-4 text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2">
                                        <Link href={`/course/${item.id}`}>{item.courseName}</Link>
                                    </h3>

                                    {/* Price Section */}
                                    <div className="mt-4 flex items-center">
                                        <span className="text-xl font-bold text-gray-900">₹{item.offerprice}</span>
                                        {item.price > item.offerprice && (
                                            <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
                                        )}
                                        {item.price > item.offerprice && (
                                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                {Math.round((1 - item.offerprice/item.price) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating and Enroll Button */}
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex text-yellow-400 mr-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">(06)</span>
                                        </div>
                                        
                                        <Link 
                                            href={`/course/${item.id}`}
                                            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                        >
                                            Enroll Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center ">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No courses available</h3>
                        <p className="text-gray-500 max-w-md mx-auto">We're currently updating our course catalog. Check back soon for exciting new learning opportunities.</p>
                        <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                            Notify Me
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}