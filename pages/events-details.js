import Layout from "@/components/layout/Layout"
import EventSpeakerSlider1 from "@/components/slider/EventSpeakerSlider1"
import Link from "next/link"
export default function EventDetails() {

    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Event Details">
                <section className="event-details-area section-py-120">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-73">
                                <div className="event-details-content">
                                    <h2 className="title">Global Education Fall Meeting for Every Students Who Are Interested</h2>
                                    <div className="event-meta">
                                        <ul className="list-wrap">
                                            <li><i className="flaticon-pin-1" />DNCC Party Hall, United Kingdom</li>
                                            <li><i className="flaticon-calendar-date" />25 Dec, 2023</li>
                                            <li><i className="flaticon-timer" />11:35 PM - 11:37 PM</li>
                                            <li><i className="flaticon-phone" />+123 599 8222</li>
                                        </ul>
                                    </div>
                                    <div className="event-details-img">
                                        <img src="/assets/img/events/event_details_img.jpg" alt="img" />
                                    </div>
                                    <h4 className="title-two">About The Event :</h4>
                                    <p className="info-one">Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec odio aea the dumm ipsumm ipsum that dolocons rsus mal suada and fadolorit to the consectetur elit. All the Lorem Ipsum generators on the Internet tend to repeat that predefined chunks as necessary, making this the first true dummy generator on the Internet. It uses a dictionary of over 200 Latin words, combined Lorem Ipsum looks reasonable.</p>
                                    <h4 className="title-two">During this event we’ll cover :</h4>
                                    <p className="info-two">Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec odio aea the dumm ipsumm ipsum that dolocons rsus mal suada and fadolorit.</p>
                                    <div className="event-details-list">
                                        <ul className="list-wrap">
                                            <li><i className="fas fa-check-circle" />Become a UX designer.</li>
                                            <li><i className="fas fa-check-circle" />Create quick wireframes.</li>
                                            <li><i className="fas fa-check-circle" />You will be able to add UX designe</li>
                                            <li><i className="fas fa-check-circle" />Downloadable exercise files</li>
                                            <li><i className="fas fa-check-circle" />Become a UI designer.</li>
                                        </ul>
                                    </div>
                                    <h4 className="title-two">Venue Map Direction:</h4>
                                    <p className="info-three">Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec odio aea the dumm ipsumm ipsum that dolocons rsus mal suada and fadolorit.</p>
                                    <div className="map-direction">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96811.54759587669!2d-74.01263924803828!3d406880494567041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x89c25bae694479a3%3A0xb9949385da52e69e!2sBarclays%20Center!5e0!3m2!1sen!2sbd!4v1636195194646!5m2!1sen!2sbd" allowFullScreen loading="lazy" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-27">
                                <aside className="event__sidebar">
                                    <div className="event-widget">
                                        <div className="speakers-content-top">
                                            <h4 className="ew-title">Our Speakers</h4>
                                            <div className="speakers-nav" />
                                        </div>
                                        <EventSpeakerSlider1 />
                                    </div>
                                    <div className="event-widget">
                                        <div className="event-cost-wrap">
                                            <h4 className="price"><strong>Costs:</strong>$25.00 <span>$84.99</span></h4>
                                            <Link href="#" className="btn">Join Now</Link>
                                            <div className="event-information-wrap">
                                                <h6 className="title">Information</h6>
                                                <ul className="list-wrap">
                                                    <li><i className="flaticon-timer" />Duration <span>5.2 Hours</span></li>
                                                    <li><i className="flaticon-file" />Estimated Seat <span>250</span></li>
                                                    <li><i className="flaticon-user-1" />Joined <span>190</span></li>
                                                    <li><i className="flaticon-bars" />Laguage <span>English</span></li>
                                                    <li><i className="flaticon-flash" />Category <span>Desing</span></li>
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
                                    <div className="event-widget">
                                        <h4 className="ew-title">Sponsors</h4>
                                        <div className="sponsors-wrap">
                                            <ul className="list-wrap">
                                                <li><img src="/assets/img/brand/e_brand01.png" alt="" /></li>
                                                <li><img src="/assets/img/brand/e_brand02.png" alt="" /></li>
                                                <li><img src="/assets/img/brand/e_brand03.png" alt="" /></li>
                                            </ul>
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