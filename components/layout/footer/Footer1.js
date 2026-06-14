import Link from "next/link"

export default function Footer1() {
    return (
        <>
            <footer   style={{ backgroundColor: '#355E3B' }} >
                <div className="footer__top-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget">
                                    <div className="footer__about">
                                        <div >
                                            <Link href="/"><img src="/logo.jpg" alt="img" className="w-full h-20 mb-4" /></Link>
                                        </div>
                                        {/* <p>त्रिबंधु's Nurtue Nature & Future</p> */}
                                        <ul className="list-wrap m-0 p-0">
                                            <li className="address">Sai Complex, Benipur Pokhra, Benipur Road, Pahariya-221007 </li>
                                            <li className="number">9205204647/9711956656</li>
                                            <li className="socials">
    <Link href="https://wa.me/9711956656"><i className="fab fa-whatsapp" /></Link>
    <Link href="https://www.instagram.com/sengar_classes?igsh=MTB4NHhkbmNpZHg2dg%3D%3D&utm_source=qr"><i className="fab fa-instagram" /></Link>
    <Link href="https://youtube.com/@sengar_career_institute?si=QoZnxxDSfA8QvAK-"><i className="fab fa-youtube" /></Link>
</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Resources</h4>
                                    <ul className="list-wrap">
                                        {/* <li><Link href="/about-us">About</Link></li> */}
                                        <li><Link href="/contact">Contact</Link></li>
                                        <li><Link href="/contact">Help Center</Link></li>
                                        <li><Link href="/termsofuse">Terms Of Use</Link></li>
                                        <li><Link href="/refundpolicy">Refund Policy</Link></li>
                                        <li><Link href="/privacypolicy">Privacy Policy</Link></li>
                                        {/* <li><Link href="/paymentterms">Payment Terms</Link></li> */}
                                    </ul>
                                </div>
                            </div>
                            {/* <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget widget_nav_menu">
                                    <h4 className="fw-title">Courses</h4>
                                    <ul className="list-wrap">
                                        <li><Link href="/courses">Courses</Link></li>
                                        <li><Link href="/courses">Test Series</Link></li>
                                        <li><Link href="/courses">Study Material</Link></li>
                                        <li><Link href="/courses">You Tube Lecture</Link></li>
                                    </ul>
                                </div>
                            </div> */}
                            {/* <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="footer-widget">
                                    <h4 className="fw-title">Working Hours</h4>
                                    <div className="footer__working-list">
                                        <div className="footer__working-item">
                                            <span className="day">Mon - Fri</span>
                                            <span className="time">8:00 AM - 5:00 PM</span>
                                        </div>
                                        <div className="footer__working-item">
                                            <span className="day">Mon - Fri</span>
                                            <span className="time">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="footer__working-item">
                                            <span className="day">Mon - Fri</span>
                                            <span className="time">10:00 AM - 8:00 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="copyright__wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="copyright__text">
                                    <p>Copyright © {new Date().getFullYear()} techrakshak. All rights reserved.</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="copyright__menu">
                                    <ul className="list-wrap d-flex flex-wrap justify-content-center justify-content-lg-end">
                                        <li><Link href="#">Privacy Policy</Link></li>
                                        <li><Link href="#">Terms  Conditions</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
