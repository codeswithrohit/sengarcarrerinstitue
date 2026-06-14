import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function Mentors() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Top Class Mentors">
                <section className="mentors-area section-pt-120 section-pb-90">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors01.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Robert Smith</Link></h4>
                                            <span className="designation">Graphic Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,135 Students</li>
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
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors02.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Olivia Mia</Link></h4>
                                            <span className="designation">Web Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,135 Students</li>
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
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors03.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">William Hope</Link></h4>
                                            <span className="designation">Digital Marketing</span>
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
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors04.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Sophia Ava</Link></h4>
                                            <span className="designation">Web Development</span>
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
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors05.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Ronald Richards</Link></h4>
                                            <span className="designation">Web Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,235 Students</li>
                                                <li className="rating">
                                                    <i className="fas fa-star" />
                                                    <span className="rating-count">(4.8)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors06.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Floyd Miles</Link></h4>
                                            <span className="designation">UX/UI Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,435 Students</li>
                                                <li className="rating">
                                                    <i className="fas fa-star" />
                                                    <span className="rating-count">(4.6)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors07.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Eleanor Pena</Link></h4>
                                            <span className="designation">Digital Marketing</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,835 Students</li>
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
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors08.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Jacob Jones</Link></h4>
                                            <span className="designation">Web Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,335 Students</li>
                                                <li className="rating">
                                                    <i className="fas fa-star" />
                                                    <span className="rating-count">(4.1)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors09.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Robert Fox</Link></h4>
                                            <span className="designation">Graphics Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,635 Students</li>
                                                <li className="rating">
                                                    <i className="fas fa-star" />
                                                    <span className="rating-count">(4.4)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors02.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Olivia Mia</Link></h4>
                                            <span className="designation">Web Design</span>
                                        </div>
                                        <div className="mentors__content-bottom">
                                            <ul className="list-wrap">
                                                <li className="students"><i className="flaticon-user-1" />1,135 Students</li>
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
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors03.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">William Hope</Link></h4>
                                            <span className="designation">Digital Marketing</span>
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
                            <div className="col-xl-3 col-lg-4 col-sm-6">
                                <div className="mentors__item">
                                    <div className="mentors__img">
                                        <Link href="/instructor-details">
                                            <img src="/assets/img/mentors/mentors04.png" alt="mentor" />
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
                                            <h4 className="name"><Link href="/instructor-details">Sophia Ava</Link></h4>
                                            <span className="designation">Web Development</span>
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
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}