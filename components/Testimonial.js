import React, { useState, useEffect } from 'react';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Verma',
      role: 'JEE Advanced 2023 - AIR 1875',
      content: 'Sengar Career Institute provided exceptional guidance for JEE preparation. Their faculty simplified complex concepts and the test series was perfectly aligned with the actual exam pattern.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Singh',
      role: 'NEET 2023 - AIR 756',
      content: 'The biology faculty at Sengar Career Institute is outstanding. Their NCERT-focused approach and regular doubt-clearing sessions helped me secure admission at AIIMS Delhi.',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 5
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      role: 'Class 12 CBSE - 97.8%',
      content: 'Thanks to Sengar Career Institute, I scored 100 in Accounts and 99 in Business Studies. Their commerce faculty made complex topics incredibly easy to understand.',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5
    },
    {
      id: 4,
      name: 'Ananya Kapoor',
      role: 'Class 10 ICSE - 98.2%',
      content: 'Sengar Career Institute made board preparation systematic and stress-free. Their chapter-wise tests and revision strategy helped me excel without last-minute pressure.',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 5
    },
    {
      id: 5,
      name: 'Vikram Malhotra',
      role: 'JEE Mains 2023 - 99.9 percentile',
      content: 'The integrated program at Sengar Career Institute helped me balance school and JEE preparation perfectly. Their study material is comprehensive and well-structured!',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      rating: 5
    },
    {
      id: 6,
      name: 'Neha Gupta',
      role: 'NEET 2023 - AIR 2154',
      content: 'Sengar Career Institute chemistry faculty made organic chemistry so approachable. Their 3-tier problem solving approach transformed my preparation strategy completely.',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 5
    },
    {
      id: 7,
      name: 'Aditya Nair',
      role: 'Class 12 Commerce - 96.8%',
      content: 'The pre-board crash course was transformative. Sengar Career Institute helped me revise the entire commerce syllabus effectively in just 3 weeks.',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      rating: 5
    },
    {
      id: 8,
      name: 'Isha Patel',
      role: 'Class 10 CBSE - 97.4%',
      content: 'Sengar Career Institute foundation course built my concepts so strong that I was well-prepared for competitive exams along with boards.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const testimonialsPerSlide = 4;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleTestimonials = testimonials.slice(
    currentSlide * testimonialsPerSlide,
    (currentSlide + 1) * testimonialsPerSlide
  );

  // Fill in empty slots if needed
  while (visibleTestimonials.length < testimonialsPerSlide) {
    visibleTestimonials.push(testimonials[visibleTestimonials.length % testimonials.length]);
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Our Achievers Speak
            </span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            Success Stories from Sengar Career Institute Students
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {visibleTestimonials.map((testimonial, index) => (
              <div 
                key={`${currentSlide}-${index}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col border-l-4 border-green-500"
              >
                <div className="flex items-center mb-4">
                  <img 
                    className="h-12 w-12 rounded-full object-cover border-2 border-green-100"
                    src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740'
                    alt={testimonial.name}
                  />
                  <div className="ml-3">
                    <h4 className="text-md font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-green-600 text-sm font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-600 flex-grow">
                  <p className="text-xs font-bold">"{testimonial.content}"</p>
                </blockquote>
                <div className="mt-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Sengar Career Institute
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-md hover:bg-green-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-green-600 w-6' : 'bg-green-200 w-3'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-md hover:bg-green-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Trusted by students preparing for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Class 8-10 Foundation</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Class 11-12 Science</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Class 11-12 Commerce</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">IIT-JEE</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">NEET</span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Board Exams</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;