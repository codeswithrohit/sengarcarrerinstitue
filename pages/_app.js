import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from "react"
import Head from "next/head"
import Cursor from "@/components/elements/CursorEffect"
import { Provider } from "react-redux"
import "slick-carousel/slick/slick.css"
import { store } from "../features/store"
import "/public/assets/css/animate.min.css"
import "/public/assets/css/aos.css"
import "/public/assets/css/bootstrap.min.css"
import "/public/assets/css/default-icons.css"
import "/public/assets/css/flaticon-eduvalt.css"
import "/public/assets/css/fontawesome-all.min.css"
import "/public/assets/css/magnific-popup.css"
import "/public/assets/css/main.css"
import "/public/assets/css/odometer.css"
import "/public/assets/css/select2.min.css"
import "/public/assets/css/spacing.css"
import "/public/assets/css/tg-cursor.css"
import 'tailwindcss/tailwind.css';
import { firebase } from "../Firebase/config";

// Modern Custom Preloader Component
const CustomPreloader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F9F9F9] z-[9999]">
      <div className="relative flex flex-col items-center animate-pulse">
        {/* Update this path to where your TRI-S logo is saved in the public folder */}
        <img 
          src="/logo.jpg" 
          alt="Sengar Career Institute Loading" 
          className="h-20 md:h-28 object-contain mb-6 drop-shadow-sm"
        />
        
        {/* Animated Loading Dots matched to logo colors */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-[#D45D40] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(true)
    const [courses, setCourses] = useState([]);
  
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const snapshot = await firebase.firestore().collection("courses").get();
          const courseData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCourses(courseData);
        } catch (error) {
          console.error("Error fetching courses: " + error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCourses();
    }, []);

    // JSON-LD Schema for Local Educational Organization
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Sengar Career Institute",
      "description": "A trusted coaching institute in Varanasi offering quality preparation for school academics (Classes 9 to 12) and competitive exams like JEE and NEET. Focuses on concept-based learning in Physics, Chemistry, Mathematics, and Biology.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Varanasi",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
      },
      "areaServed": "Varanasi",
      "slogan": "Guiding every student toward academic success through concept-based learning and continuous practice.",
      "offers": [
        {
          "@type": "Offer",
          "name": "JEE (Joint Entrance Examination) Preparation",
          "category": "Test Preparation"
        },
        {
          "@type": "Offer",
          "name": "NEET (National Eligibility cum Entrance Test) Preparation",
          "category": "Test Preparation"
        },
        {
          "@type": "Offer",
          "name": "Classes 9 to 12 Academic Coaching",
          "description": "Strong concepts in Physics, Chemistry, Mathematics, and Biology."
        }
      ],
      "featureList": [
        "Experienced faculty",
        "Regular test series",
        "Doubt-clearing sessions",
        "Disciplined learning environment"
      ]
    };

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>Sengar Career Institute | Top JEE, NEET & Classes 9-12 Coaching in Varanasi</title>
                <meta name="title" content="Sengar Career Institute | Top JEE, NEET & Classes 9-12 Coaching in Varanasi" />
                <meta 
                    name="description" 
                    content="Sengar Career Institute is a trusted coaching institute in Varanasi offering quality preparation for academics (Classes 9-12) and competitive exams like JEE and NEET. Master Physics, Chemistry, Mathematics, and Biology with experienced faculty, regular test series, and doubt-clearing sessions." 
                />
                <meta 
                    name="keywords" 
                    content="Sengar Career Institute, Varanasi Coaching, JEE preparation Varanasi, NEET coaching Varanasi, Classes 9 to 12 coaching, Physics, Chemistry, Mathematics, Biology tutoring, board exams preparation, concept-based learning" 
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Sengar Career Institute | Expert JEE & NEET Coaching in Varanasi" />
                <meta property="og:description" content="Achieve excellent results in board and competitive exams with Sengar Career Institute. We offer a disciplined learning environment, doubt-clearing sessions, and concept-based learning for Classes 9-12, JEE, and NEET." />
                <meta property="og:image" content="/logo.jpg" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content="Sengar Career Institute | Top JEE, NEET & Academic Coaching" />
                <meta property="twitter:description" content="Trusted coaching in Varanasi for Classes 9-12, JEE, and NEET. Improve problem-solving skills in Physics, Chemistry, Math, and Biology." />
                <meta property="twitter:image" content="/logo.jpg" />

                {/* JSON-LD Structured Data */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            {!loading ? (
                <Provider store={store}>
                    <Component courses={courses} loading={loading} {...pageProps} />
                </Provider>
            ) : (
                <CustomPreloader />
            )}
        </>
    )
}

export default MyApp