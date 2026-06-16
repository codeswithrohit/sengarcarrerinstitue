import CounterUp from "@/components/elements/CounterUp"
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function AboutUs() {

    return (
        <>
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="About Us">
                <div>
                    {/* About Section */}
                    <section className="about-area-two">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-5 col-lg-6">
                                    <div className="about__title-wrap">
                                        <div className="section__title">
                                            <span className="sub-title">Who we are</span>
                                            <h2 className="title tg-svg">Sengar Career Institute: <span className="position-relative"><span className="svg-icon" id="about-svg" data-svg-icon="assets/img/icons/title_shape.svg" />Trusted</span> Learning Hub</h2>
                                        </div>
                                        <p className="fw-medium">
                                            Sengar Career Institute is a trusted coaching institute in Varanasi offering quality preparation for school academics and competitive exams like Joint Entrance Examination (JEE) and National Eligibility cum Entrance Test (NEET).
                                        </p>
                                        <p>
                                            We focus on building strong concepts in Physics, Chemistry, Mathematics, and Biology for students from Classes 9 to 12. With experienced faculty, regular test series, doubt-clearing sessions, and a disciplined learning environment, Sengar Career Institute helps students improve problem-solving skills and achieve excellent results in board and competitive exams. Our goal is to guide every student toward academic success through concept-based learning and continuous practice.
                                        </p>
                                        <div className="tg-button-wrap">
                                            <Link href="/courses" className="btn tg-svg"><span className="text">Explore Our Programs</span> <span className="svg-icon" id="about-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-xl-3 col-lg-5 col-md-7">
                                    <div className="about__images-wrap">
                                        <div className="column">
                                         
                                            <img className="" src="/assets/img/about/about_standard.jpg" alt="Sengar Career Institute" />
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="fact-area fact-bg" data-background="/assets/img/bg/fact_bg.jpg">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-5 col-lg-7 col-md-9">
                                    <div className="section__title text-center mb-50">
                                        <span className="sub-title"> Our Achievement</span>
                                        <h2 className="title tg-svg">Grow Your <span className="position-relative"><span className="svg-icon" id="fact-title" data-svg-icon="assets/img/icons/title_shape.svg" />Skills</span> To Advance Your Career</h2>
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
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="fact__item-two text-center">
                                        <div className="fact__icon-two">
                                            <i className="flaticon-trophy" />
                                        </div>
                                        <div className="fact__content-two">
                                            <h3 className="count"><CounterUp end={3000} /></h3>
                                            <p>Board Score 90%+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </Layout>
        </>
    )
}