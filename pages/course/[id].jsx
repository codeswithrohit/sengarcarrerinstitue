import VideoPopup from "@/components/elements/VidepPopup"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import courses from "../../data/courses.json"
import { firebase } from "../../Firebase/config";
const CourseSingle = () => {
    const router = useRouter()
    const [course, setCourse] = useState({})
    const id = router.query.id
    const [coursedata, setCourseData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Review form state
    const [reviewForm, setReviewForm] = useState({
        name: '',
        email: '',
        title: '',
        rating: 0,
        comment: '',
    });

    useEffect(() => {
        const db = firebase.firestore();
        const productRef = db.collection("courses").doc(id);

        productRef.get().then((doc) => {
            if (doc.exists) {
                setCourseData({ ...doc.data(), id: doc.id });
                
                // Fetch reviews if they exist
                if (doc.data().reviews) {
                    setReviews(doc.data().reviews);
                }
            } else {
                console.log("Document not found!");
            }
            setIsLoading(false);
        });
    }, [id]);

    const [activeIndex, setActiveIndex] = useState(1)
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }
    const [isActive, setIsActive] = useState({
        status: false,
        key: 1,
    })

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    const handleRatingClick = (rating) => {
        setReviewForm(prev => ({
            ...prev,
            rating
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const db = firebase.firestore();
            const courseRef = db.collection("courses").doc(id);
            
            // Create new review object
            const newReview = {
                ...reviewForm,
                date: new Date().toISOString(),
            };
            
            // Update the course document with the new review
            await courseRef.update({
                reviews: firebase.firestore.FieldValue.arrayUnion(newReview)
            });
            
            // Update local state
            setReviews(prev => [...prev, newReview]);
            
            // Reset form
            setReviewForm({
                name: '',
                email: '',
                title: '',
                rating: 0,
                comment: '',
            });
            
            // Show success message or redirect
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderHTML = (htmlString) => {
        return { __html: htmlString };
    };

    // Calculate average rating
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(review => review.rating === star).length,
        percentage: reviews.length > 0 
            ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 
            : 0
    }));

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <section className="courses__breadcrumb-area mt-36">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="courses__breadcrumb-content">
                                    <Link href="#" className="category uppercase">{coursedata.selectedClass}</Link>
                                    <h3 className="title">{coursedata.courseName}</h3>
                                    <ul className="courses__item-meta list-wrap">
                                        {/* <li>
                                            <div className="author">
                                                <Link href="#"><img src="/assets/img/courses/course_author02.png" alt="img" /></Link>
                                                <Link href="#">Arian Hok</Link>
                                            </div>
                                        </li> */}
                                        <li className="uppercase" ><i className="flaticon-file" /> {coursedata.courseDuration}</li>
                                        <li><i className="flaticon-timer" /> 
  {coursedata.startDate && coursedata.endDate ? (
    <>
      Starts on {new Date(coursedata.startDate.split('/').reverse().join('-')).toLocaleDateString()} 
      Ends on {new Date(coursedata.endDate.split('/').reverse().join('-')).toLocaleDateString()}
    </>
  ) : (
    "Loading dates..."
  )}
</li>
                                        {/* <li><i className="flaticon-user-1" /> 18</li> */}
                                        <li>
                                            <div className="rating">
                                                <i className="fas fa-star" />
                                                <i className="fas fa-star" />
                                                <i className="fas fa-star" />
                                                <i className="fas fa-star" />
                                                <i className="fas fa-star" />
                                                <span className="rating-count">(4.8)</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="courses-details-area section-pb-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-9 col-lg-8">
                                <div className="courses__details-wrapper">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" onClick={() => handleOnClick(1)}>
                                            <button className={activeIndex === 1 ? "nav-link active" : "nav-link"}>Course Information</button>
                                        </li>
                                        <li className="nav-item" onClick={() => handleOnClick(2)}>
                                            <button className={activeIndex === 2 ? "nav-link active" : "nav-link"}>Reviews</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabContent">
                                        <div className={activeIndex === 1 ? "tab-pane active" : "tab-pane"}>
                                        <div className="courses__details-content">
                                                {/* Use dangerouslySetInnerHTML to render HTML content */}
                                                <div dangerouslySetInnerHTML={renderHTML(coursedata.aboutCourse)} />
                                            </div>
                                            <div className="courses__details-curriculum">
                                                <h4 className="title">Frequently Asked Questions</h4>
                                                <div className="w-full max-w-3xl mx-auto">
  {[1, 2, 3].map((item) => (
    <div key={item} className="mb-2 border border-gray-200 rounded-md overflow-hidden">
      <h2 
        className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => handleToggle(item)}
      >
        <button
          className={`w-full px-4 py-3 text-left font-medium flex items-center justify-between ${
            isActive.key === item ? 'text-primary' : 'text-gray-700'
          }`}
        >
          {item === 1 && 'Why should I join this course and how will this be helpful?'}
          {item === 2 && 'How will the classes be conducted? What will happen if I miss a class?'}
          {item === 3 && 'Can the classes be downloaded?'}
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isActive.key === item ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h2>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isActive.key === item ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-white">
          <ul className="space-y-2">
            {[
              { name: 'This course is designed to provide you with knowledge and skills in all subjects, which are highly relevant to the JEE exam pattern.', duration: '07:48' },
              { name: 'All classes will be live at the scheduled time, and if you miss any class, you can access the recording anytime', duration: '07:48' },
              { name: 'Yes, you can download videos of any courses you have enrolled in.The videos can be downloaded and watched offline in the PW app under the download section go to the Study Page & watch the downloaded video. These videos will be available until the expiry of Online Batches', duration: '10:48' },
            ].map((course, index) => (
              <li key={index} className="hover:bg-gray-50 rounded">
                <Link href="#" className="flex justify-between items-center px-3 py-2">
                  <span className="text-gray-700">{course.name}</span>
                  <div className="flex items-center space-x-3">
                    {/* <span className="text-sm text-gray-500">{course.duration}</span> */}
                    {/* <span className="text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span> */}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ))}
</div>
                                            </div>
                                            {/* <div className="courses__details-instructors">
                                                <h4 className="title">Your Instructors</h4>
                                                <div className="courses__instructors-list">
                                                    <div className="courses__instructors-item">
                                                        <div className="courses__instructors-thumb">
                                                            <Link href="/instructor-details"><img src="/assets/img/courses/details_instructors01.jpg" alt="img" /></Link>
                                                        </div>
                                                        <div className="courses__instructors-content">
                                                            <h5 className="name"><Link href="/instructor-details">Robert Smith</Link></h5>
                                                            <span className="designation">Graphic Design</span>
                                                            <ul className="meta list-wrap d-flex flex-wrap">
                                                                <li><i className="flaticon-user-1" /> 1,135 Students</li>
                                                                <li><i className="flaticon-file" /> 05</li>
                                                                <li>
                                                                    <div className="rating">
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <span className="average">(4.2)</span>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                            <p>Donald Logan has more than 15 years’ experience as a project management consultant, educator, technology consultant, business know.</p>
                                                            <div className="tg-button-wrap">
                                                                <Link href="/instructor-details" className="btn btn-border tg-svg"><span className="text">See More</span> <span className="svg-icon" id="svg-btn1" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="courses__instructors-item">
                                                        <div className="courses__instructors-thumb">
                                                            <Link href="/instructor-details"><img src="/assets/img/courses/details_instructors02.jpg" alt="img" /></Link>
                                                        </div>
                                                        <div className="courses__instructors-content">
                                                            <h5 className="name"><Link href="/instructor-details">Ketty Roagh</Link></h5>
                                                            <span className="designation">Web Developer</span>
                                                            <ul className="meta list-wrap d-flex flex-wrap">
                                                                <li><i className="flaticon-user-1" /> 1,435 Students</li>
                                                                <li><i className="flaticon-file" /> 05</li>
                                                                <li>
                                                                    <div className="rating">
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <i className="fas fa-star" />
                                                                        <span className="average">(4.2)</span>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                            <p>Donald Logan has more than 15 years’ experience as a project management consultant, educator, technology consultant, business know.</p>
                                                            <div className="tg-button-wrap">
                                                                <Link href="/instructor-details" className="btn btn-border tg-svg"><span className="text">See More</span> <span className="svg-icon" id="svg-btn2" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className={activeIndex === 2 ? "tab-pane active" : "tab-pane"}>
                    <div className="courses__details-reviews">
                        <h4 className="title">Student Ratings & Reviews</h4>
                        <div className="course-rate">
                            <div className="course-rate__summary">
                                <div className="course-rate__summary-value">{averageRating}</div>
                                <div className="course-rate__summary-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i 
                                            key={star} 
                                            className={`fas fa-star ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <div className="course-rate__summary-text">
                                    Total {reviews.length} Rating{reviews.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <div className="course-rate__details">
                                {ratingDistribution.map((item) => (
                                    <div key={item.star} className="course-rate__details-row">
                                        <div className="course-rate__details-row-star">
                                            {item.star}
                                            <i className="fas fa-star" />
                                        </div>
                                        <div className="course-rate__details-row-value">
                                            <div className="rating-gray" />
                                            <div 
                                                className="rating" 
                                                style={{ width: `${item.percentage}%` }} 
                                                title={`${item.percentage}%`} 
                                            />
                                            <span className="rating-count">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {reviews.length > 0 && (
                            <div id="course-reviews">
                                <h4 className="course-review-head">Reviews ({reviews.length})</h4>
                                <ul className="list-wrap">
                                    {reviews.map((review, index) => (
                                        <li key={index}>
                                            <div className="review-author">
                                                <img   src='https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740'
                    alt="img" />
                                            </div>
                                            <div className="review-author-info">
                                                <div className="review-stars-rated">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <i 
                                                            key={star} 
                                                            className={`fas fa-star ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <h5 className="user-name">
                                                    {review.name} 
                                                    <span className="date">
                                                        {new Date(review.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </h5>
                                                {review.title && <h6 className="review-title">{review.title}</h6>}
                                                <p>{review.comment}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="course-review-form">
                            <h4 className="course-review-head">Write a review</h4>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <input 
                                            type="text" 
                                            name="name"
                                            placeholder="Your Name" 
                                            value={reviewForm.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input 
                                            type="email" 
                                            name="email"
                                            placeholder="Your Email" 
                                            value={reviewForm.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <input 
                                    type="text" 
                                    name="title"
                                    placeholder="Review Title" 
                                    value={reviewForm.title}
                                    onChange={handleInputChange}
                                />
                                <div className="course-form-rating">
                                    <span>Select Rating:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i 
                                            key={star}
                                            className={`fas fa-star cursor-pointer ${
                                                star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                            onClick={() => handleRatingClick(star)}
                                        />
                                    ))}
                                </div>
                                <textarea 
                                    name="comment"
                                    placeholder="Type Comments" 
                                    value={reviewForm.comment}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button 
                                    className="btn" 
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit your Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4">
                                <aside className="courses__details-sidebar">
                                    <div className="event-widget">
                                        <div className="thumb" >
                                            <img src={coursedata.bannerUrl} style={{objectFit:'fill'}} alt="img" />
                                        
                                        </div>
                                        <div className="event-cost-wrap">
                                            <h4 className="price"><strong>Costs:</strong>₹{coursedata.offerprice} <span>₹{coursedata.price}</span></h4>
                                            <Link href="/sci" className="btn">Enroll This Now</Link>
                                            <div className="event-information-wrap">
                                                <h6 className="title">Include This Course</h6>
                                                <ul className="list-wrap">
                                                    <li className="uppercase" ><i className="flaticon-timer" />Duration <span>{coursedata.courseDuration}</span></li>
                                                    {/* <li><i className="flaticon-file" />Total Classes <span>{coursedata.totalClasses} Days</span></li>
                                                    <li><i className="flaticon-user-1" />Joined <span>190</span></li> */}
                                                    <li><i className="flaticon-bars" />Laguage <span>English/Hindi</span></li>
                                                    {/* <li><i className="flaticon-flash" />Category <span>Desing</span></li> */}
                                                    <li><i className="flaticon-share" />Share
                                                        <ul className="list-wrap event-social">
                                                            <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                            <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                            <li><Link href="#"><i className="fab fa-instagram" /></Link></li>
                                                            <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                             
                                </aside>
                            </div>
                        </div>
                    </div>
                </section>

            </Layout>
        </>
    )
}

export default CourseSingle
