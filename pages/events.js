import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Events() {

    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="All Events">
                <section className="events-area section-pt-120 section-pb-90">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 order-2 order-lg-0">
                                <div className="events__sidebar">
                                    <div className="blog-widget">
                                        <h4 className="widget-title">Find Your Events</h4>
                                        <div className="events__sidebar-filter">
                                            <form action="#">
                                                <div className="form-grp">
                                                    <input type="text" placeholder="Event From" />
                                                    <i className="flaticon-calendar-date" />
                                                </div>
                                                <div className="form-grp">
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option>All Categories</option>
                                                        <option>Attendance Based</option>
                                                        <option>Unscheduled Events</option>
                                                        <option>Scheduled Events</option>
                                                    </select>
                                                </div>
                                                <div className="form-grp">
                                                    <input type="text" placeholder="Location" />
                                                    <i className="flaticon-pin" />
                                                </div>
                                                <div className="form-grp">
                                                    <input type="text" placeholder="Keywords" />
                                                    <i className="flaticon-searching fa-flip-horizontal" />
                                                </div>
                                                <button type="submit">Find Events</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="blog-widget">
                                        <h4 className="widget-title">Recent Events</h4>
                                        <div className="rc-post-item">
                                            <div className="rc-post-thumb">
                                                <Link href="/blog-details">
                                                    <img src="/assets/img/blog/blog_standard01.jpg" alt="img" />
                                                </Link>
                                            </div>
                                            <div className="rc-post-content">
                                                <h4 className="title"><Link href="/blog-details">The Growing Management</Link></h4>
                                                <span className="date"><i className="flaticon-calendar-date" /> 25 Dec, 2023</span>
                                            </div>
                                        </div>
                                        <div className="rc-post-item">
                                            <div className="rc-post-thumb">
                                                <Link href="/blog-details">
                                                    <img src="/assets/img/blog/blog_standard04.jpg" alt="img" />
                                                </Link>
                                            </div>
                                            <div className="rc-post-content">
                                                <h4 className="title"><Link href="/blog-details">Make Your Magnificent</Link></h4>
                                                <span className="date"><i className="flaticon-calendar-date" /> 26 Dec, 2023</span>
                                            </div>
                                        </div>
                                        <div className="rc-post-item">
                                            <div className="rc-post-thumb">
                                                <Link href="/blog-details">
                                                    <img src="/assets/img/blog/blog_standard03.jpg" alt="img" />
                                                </Link>
                                            </div>
                                            <div className="rc-post-content">
                                                <h4 className="title"><Link href="/blog-details">The Potentially Accessibility</Link></h4>
                                                <span className="date"><i className="flaticon-calendar-date" /> 27 Dec, 2023</span>
                                            </div>
                                        </div>
                                        <div className="rc-post-item">
                                            <div className="rc-post-thumb">
                                                <Link href="/blog-details">
                                                    <img src="/assets/img/blog/blog_standard02.jpg" alt="img" />
                                                </Link>
                                            </div>
                                            <div className="rc-post-content">
                                                <h4 className="title"><Link href="/blog-details">Maring New Fundamentals</Link></h4>
                                                <span className="date"><i className="flaticon-calendar-date" /> 27 Dec, 2023</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-8">
                                <div className="row events__wrapper">
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb01.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 25 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Aewe Creating Futures Through
                                                    Technology</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> United Kingdom</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb02.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 25 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Exactly How Technology Can Make Reading</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> Tokyo Japan</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb03.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 25 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Aewe Creating Futures Through
                                                    Technology</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> New Work</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb04.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 22 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Learning JavaScript With Imagination</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> Walsenburg</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb05.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 22 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Make Your Magnificent May 2023 Edition</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> New Work</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb06.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 22 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Accessible Target Sizes Cheatsheet</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> Estes Park</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb07.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 22 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Color mechanics that he came up with during</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> Colorado</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb08.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 22 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">How To Design Effective User Onboarding</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> Alaska</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-6">
                                        <div className="events__item shine__animate-item">
                                            <div className="events__item-thumb">
                                                <Link href="/events-details" className="shine__animate-link">
                                                    <img src="/assets/img/events/event_thumb09.jpg" alt="img" />
                                                </Link>
                                                <span className="events__date"><i className="flaticon-calendar-date" /> 22 May, 2023</span>
                                            </div>
                                            <div className="events__item-content">
                                                <h4 className="title"><Link href="/events-details">Swing Into April (2023 Wallpapers Edition)</Link></h4>
                                                <span className="location"><i className="flaticon-pin-1" /> Alexander City</span>
                                            </div>
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