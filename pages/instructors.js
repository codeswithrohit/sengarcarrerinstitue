import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function Instructors() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Top Class Instructors">
                <div>
                    <section className="instructor-area section-pt-120 section-pb-70">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E2FAFF', borderRadius: '135px 0 0 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor01.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Graphic Design</span>
                                                <h4 className="name"><Link href="/instructor-details">Robert Smith</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E4FFE2', borderRadius: '135px 115px 115px 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor02.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Design</span>
                                                <h4 className="name"><Link href="/instructor-details">Olivia Mia</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E8EDFF', borderRadius: '0 135px 0 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor03.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Digital Marketing</span>
                                                <h4 className="name"><Link href="/instructor-details">William Hope</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#FFE2E2', borderRadius: '115px 135px 0 115px' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor04.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Development</span>
                                                <h4 className="name"><Link href="/instructor-details">Sophia Ava</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#FFFAE2', borderRadius: '0 135px 0 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor05.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Development</span>
                                                <h4 className="name"><Link href="/instructor-details">Ronald Richards</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E6E2FF', borderRadius: '115px 135px 0 115px' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor06.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Development</span>
                                                <h4 className="name"><Link href="/instructor-details">Floyd Miles</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#FFE8F4', borderRadius: '135px 0 0 0px' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor07.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Development</span>
                                                <h4 className="name"><Link href="/instructor-details">Eleanor Pena</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E2FFFC', borderRadius: '135px 115px 115px 0px' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor08.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Development</span>
                                                <h4 className="name"><Link href="/instructor-details">Jacob Jones</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E2FAFF', borderRadius: '135px 0 0 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor09.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Graphic Design</span>
                                                <h4 className="name"><Link href="/instructor-details">Robert Fox</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E4FFE2', borderRadius: '135px 115px 115px 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor02.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Design</span>
                                                <h4 className="name"><Link href="/instructor-details">Wade Warren</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#E8EDFF', borderRadius: '0 135px 0 0' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor03.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Digital Marketing</span>
                                                <h4 className="name"><Link href="/instructor-details">Guy Hawkins</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-sm-6">
                                    <div className="instructor__item">
                                        <div className="instructor__img">
                                            <div className="instructor__shape" style={{ backgroundColor: '#FFE2E2', borderRadius: '115px 135px 0 115px' }} />
                                            <Link href="/instructor-details"><img src="/assets/img/instructor/instructor04.png" alt="instructor" /></Link>
                                        </div>
                                        <div className="instructor__content">
                                            <div className="left">
                                                <span className="designation">Web Development</span>
                                                <h4 className="name"><Link href="/instructor-details">Bessie Cooper</Link></h4>
                                            </div>
                                            <div className="right">
                                                <span className="share"><i className="flaticon-share" /></span>
                                                <ul className="social-list list-wrap">
                                                    <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                    <li><Link href="#"><i className="fab fa-youtube" /></Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="quick__action-area section-pb-90">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-6 col-md-10 col-sm-11">
                                    <div className="quick__action-item" data-background="/assets/img/bg/quick_action01.jpg">
                                        <div className="quick__action-content">
                                            <h4 className="title">Best Instructors from around <br /> the world</h4>
                                            <div className="tg-button-wrap">
                                                <Link href="/contact" className="btn white-btn tg-svg"><span className="text">Register Now</span> <span className="svg-icon" id="reg-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-10 col-sm-11">
                                    <div className="quick__action-item" data-background="/assets/img/bg/quick_action02.jpg">
                                        <div className="quick__action-content">
                                            <h4 className="title">Get unlimited access to 6,000+ of courses</h4>
                                            <div className="tg-button-wrap">
                                                <Link href="/contact" className="btn white-btn tg-svg"><span className="text">Discover Now</span> <span className="svg-icon" id="discover-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
                                            </div>
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