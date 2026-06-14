import CounterUp from "@/components/elements/CounterUp"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function AboutUs() {

    return (
        <>
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="About Us">
                <div>
                    <section className="about-area-two">
                        <div className="container">
                            <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-6">
    <div className="about__title-wrap">
        <div className="section__title">
            <span className="sub-title">Who we are</span>
            <h2 className="title tg-svg">Tris Education: <span className="position-relative"><span className="svg-icon" id="about-svg" data-svg-icon="assets/img/icons/title_shape.svg" />Revolutionary</span> Learning Platform</h2>
        </div>
        <p className="fw-medium">Founded by Anurag Singh, a visionary educator with 20+ years of experience as an engineer and mentor, Tris is transforming education with our unique integrated approach.</p>
        <p>At Tris, we offer comprehensive learning solutions that combine IIT-JEE, NEET, School curriculum, and Board preparation - all in the same fees and time frame. Our innovative foundation courses build strong conceptual understanding while our specialized batches cater to competitive exam aspirants. Experience the Tris difference where quality education meets affordability and efficiency.</p>
        <div className="tg-button-wrap">
            <Link href="/courses" className="btn tg-svg"><span className="text">Explore Our Programs</span> <span className="svg-icon" id="about-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
        </div>
    </div>
</div>
                                <div className="col-xl-3 col-lg-5 col-md-7">
                                    <div className="about__images-wrap">
                                        <div className="column">
                                            <img className="" src="/anuragsir.jpeg" alt="img" />
                                        </div>
                                        {/* <div className="column">
                                            <img src="/assets/img/others/about_img04.jpg" alt="img" />
                                            <img src="/assets/img/others/about_img05.jpg" alt="img" />
                                        </div>
                                        <div className="about__shapes">
                                            <img src="/assets/img/objects/about_shape01.png" alt="img" className="about-shape-01" data-aos="fade-down-left" />
                                            <img src="/assets/img/objects/about_shape02.png" alt="img" className="about-shape-02" data-aos="fade-up-right" />
                                            <img src="/assets/img/objects/about_shape03.png" alt="img" className="about-shape-03 rotateme" />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="fact-area fact-bg" data-background="/assets/img/bg/fact_bg.jpg">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-5 col-lg-7 col-md-9">
                                    <div className="section__title text-center mb-50">
                                        <span className="sub-title"> Our Achievement</span>
                                        <h2 className="title tg-svg">Grow You <span className="position-relative"><span className="svg-icon" id="fact-title" data-svg-icon="assets/img/icons/title_shape.svg" />Skills</span>To Advance Your Career path</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="fact__item-two text-center">
                                        <div className="fact__icon-two">
                                            <i className="flaticon-webinar" />
                                        </div>
                                        <div className="fact__content-two">
                                            <h3 className="count"><CounterUp end={20000} /></h3>
                                            <p>Students Enrolled</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="fact__item-two text-center">
                                        <div className="fact__icon-two">
                                            <i className="flaticon-graduates" />
                                        </div>
                                        <div className="fact__content-two">
                                            <h3 className="count"><CounterUp end={2000} /></h3>
                                            <p>Selected Students</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="fact__item-two text-center">
                                        <div className="fact__icon-two">
                                            <i className="flaticon-countries" />
                                        </div>
                                        <div className="fact__content-two">
                                            <h3 className="count"><CounterUp end={312} /></h3>
                                            <p>World Countries</p>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="fact__item-two text-center">
                                        <div className="fact__icon-two">
                                            <i className="flaticon-trophy" />
                                        </div>
                                        <div className="fact__content-two">
                                            <h3 className="count"><CounterUp end={3000} /></h3>
                                            <p>Board IN 90%+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mentors-area position-relative section-pt-120 section-pb-90">
                        <div className="container">
                            <div className="section__title-wrap mb-55">
                                <div className="row align-items-center gap-4 gap-md-0">
                                    <div className="col-md-8">
                                        <div className="section__title text-center text-md-start">
                                            <span className="sub-title">Our Qualified People Matter</span>
                                            <h2 className="title tg-svg">Top <span className="position-relative"><span className="svg-icon" id="svg-8" data-svg-icon="assets/img/icons/title_shape.svg" />Class</span> Mentors</h2>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-4">
                                        <div className="tg-button-wrap justify-content-center justify-content-md-end">
                                            <Link href="/instructor" className="btn btn-border tg-svg"><span className="text">All Instructors</span> <span className="svg-icon" id="mentors-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="row justify-content-center">
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="mentors__item">
                                        <div className="mentors__img">
                                            <Link href="#">
                                                <img  className="h-36 w-36 object-contain" src="/anuragsir.jpeg" alt="mentor" />
                                            </Link>
                                            <div className="mentors__social">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mentors__content">
                                            <div className="mentors__content-top">
                                                <h4 className="name"><Link href="#">Anurag Singh</Link></h4>
                                                <span className="designation">Physics Facylty</span>
                                            </div>
                                            <div className="mentors__content-bottom">
                                                <ul className="list-wrap">
                                                    <li className="students"><i className="flaticon-user-1" />2,235 Students</li>
                                                    <li className="rating">
                                                        <i className="fas fa-star" />
                                                        <span className="rating-count">(4.2)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="mentors__item">
                                        <div className="mentors__img">
                                            <Link href="#">
                                                <img className="h-36 w-36 object-contain" src="/sundramsir.jpeg" alt="mentor" />
                                            </Link>
                                            <div className="mentors__social">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mentors__content">
                                            <div className="mentors__content-top">
                                                <h4 className="name"><Link href="#">Sundram Sir</Link></h4>
                                                <span className="designation">Math Faculty</span>
                                            </div>
                                            <div className="mentors__content-bottom">
                                                <ul className="list-wrap">
                                                    <li className="students"><i className="flaticon-user-1" />4,135 Students</li>
                                                    <li className="rating">
                                                        <i className="fas fa-star" />
                                                        <span className="rating-count">(5.0)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="mentors__item">
                                        <div className="mentors__img">
                                            <Link href="#">
                                                <img  className="h-36 w-36 object-contain" src="/shivamsir.png" alt="mentor" />
                                            </Link>
                                            <div className="mentors__social">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mentors__content">
                                            <div className="mentors__content-top">
                                                <h4 className="name"><Link href="#">Shivam Sir</Link></h4>
                                                <span className="designation">Chemistry Faculty</span>
                                            </div>
                                            <div className="mentors__content-bottom">
                                                <ul className="list-wrap">
                                                    <li className="students"><i className="flaticon-user-1" />2,135 Students</li>
                                                    <li className="rating">
                                                        <i className="fas fa-star" />
                                                        <span className="rating-count">(4.9)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="mentors__item">
                                        <div className="mentors__img">
                                            <Link href="#">
                                                <img  className="h-36 w-36 object-contain" src="/shubhamsir.jpeg" alt="mentor" />
                                            </Link>
                                            <div className="mentors__social">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mentors__content">
                                            <div className="mentors__content-top">
                                                <h4 className="name"><Link href="#">Shubham Sir</Link></h4>
                                                <span className="designation">Biology Faculty</span>
                                            </div>
                                            <div className="mentors__content-bottom">
                                                <ul className="list-wrap">
                                                    <li className="students"><i className="flaticon-user-1" />3,235 Students</li>
                                                    <li className="rating">
                                                        <i className="fas fa-star" />
                                                        <span className="rating-count">(4.7)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              
                            </div>
                        </div>
                        <div className="mentors__shapes">
                            <img src="/assets/img/objects/mentors_shape01.png" alt="shape" />
                            <img src="/assets/img/objects/mentors_shape02.png" alt="shape" />
                        </div>
                    </section>
                    <section className="cta-area-two position-relative">
                        <div className="cta__bg" data-background="/assets/img/bg/cta_bg.jpg" />
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-10">
                                    <div className="cta__content">
                                        <p>ARE YOU READY FOR THIS OFFER</p>
                                        <h2 className="title">50% Offer For Very First 50</h2>
                                        <h5 className="sub-title">Student’s  Mentors</h5>
                                        <div className="tg-button-wrap justify-content-center">
                                            <Link href="/contact" className="btn tg-svg"><span className="text">Become a Student</span> <span className="svg-icon" id="cta-btn-2" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cta__shapes">
                            <img src="/assets/img/objects/cta_shape001.svg" alt="img" className="position-absolute" data-aos="fade-down-right" data-aos-delay={300} />
                            <img src="/assets/img/objects/cta_shape002.png" alt="img" className="position-absolute" />
                            <img src="/assets/img/objects/cta_shape003.svg" alt="img" className="position-absolute" data-aos="fade-up-left" data-aos-delay={300} />
                        </div>
                    </section>
                </div>

            </Layout>
        </>
    )
}