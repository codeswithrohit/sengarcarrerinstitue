import Layout from "@/components/layout/Layout"
import CourseSlider1 from "@/components/slider/CourseSlider1"
import Link from "next/link"

export default function InstructorDetails() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Instructor Details">
                <div>
                    <section className="instructor-details-area">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="instructor-details-wrap">
                                        <div className="instructor-details-img">
                                            <img src="/assets/img/instructor/instructor_details_img.jpg" alt="img" />
                                        </div>
                                        <div className="instructor-details-content">
                                            <div className="content-top">
                                                <div className="left-side-content">
                                                    <h2 className="title">Jenny Wilson</h2>
                                                    <span>Graphic Designer</span>
                                                </div>
                                                <div className="instructor-details-social">
                                                    <ul className="list-wrap">
                                                        <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                        <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                        <li><Link href="#"><i className="fab fa-whatsapp" /></Link></li>
                                                        <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                        <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="instructor-info-wrap">
                                                <ul className="list-wrap">
                                                    <li>
                                                        <div className="rating">
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                        </div>
                                                        (4.2 Reviews)
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-email" />
                                                        <Link href="mailto:info@gmail.com">info@gmail.com</Link>
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-group-1" />
                                                        1,135 Students
                                                    </li>
                                                    <li>
                                                        <i className="flaticon-file" />
                                                        12 Courses
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bio-content">
                                                <h4 className="title">Short Bio:</h4>
                                                <p>suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti bulum a nec odio aea theawr dumm ipsumm ipsum that dolocons rsus suada and fadolorit consectetur elit. All the Lorem Ipsum generators on their the Internet tend repeat predefined chunks dumme lisis Lorem.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="courses-area-three instructor-courses-area">
                        <div className="container">
                            <div className="courses-title">
                                <h4 className="title">My Courses</h4>
                            </div>
                            <CourseSlider1 />
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    )
}