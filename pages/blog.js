import BlogPost from "@/components/blog/BlogPost"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Home() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Blog Standard ">
                <section className="blog-standard-area section-py-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <BlogPost showItem={6} style={2} showPagination />
                            </div>
                            <div className="col-lg-4">
                                <aside className="blog-sidebar">
                                    <div className="blog-widget widget_search">
                                        <div className="sidebar-search-form">
                                            <form action="#">
                                                <input type="text" placeholder="Search here" />
                                                <button><i className="flaticon-magnifying-glass" /></button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="blog-widget">
                                        <h4 className="widget-title">Categories</h4>
                                        <div className="shop-cat-list">
                                            <ul className="list-wrap">
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_1" />
                                                        <label className="form-check-label" htmlFor="cat_1">Art  Design (8)</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_2" />
                                                        <label className="form-check-label" htmlFor="cat_2">Business (12)</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_3" />
                                                        <label className="form-check-label" htmlFor="cat_3">Data Science (7)</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_4" />
                                                        <label className="form-check-label" htmlFor="cat_4">Development (10)</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_5" />
                                                        <label className="form-check-label" htmlFor="cat_5">Finance (8)</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_6" />
                                                        <label className="form-check-label" htmlFor="cat_6">Health  Fitness (8)</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="cat_7" />
                                                        <label className="form-check-label" htmlFor="cat_7">Lifestyle (9)</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="blog-widget">
                                        <h4 className="widget-title">Recent Posts</h4>
                                        <div className="rc-post-item">
                                            <div className="rc-post-thumb">
                                                <Link href="/blog-details">
                                                    <img src="/assets/img/blog/blog_standard01.jpg" alt="img" />
                                                </Link>
                                            </div>
                                            <div className="rc-post-content">
                                                <h4 className="title"><Link href="/blog-details">The Growing Need Management</Link></h4>
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
                                                <h4 className="title"><Link href="/blog-details">Make Your Edition Magnificent</Link></h4>
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
                                                <h4 className="title"><Link href="/blog-details">The Potentially Non Accessibility</Link></h4>
                                                <span className="date"><i className="flaticon-calendar-date" /> 27 Dec, 2023</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog-widget">
                                        <h4 className="widget-title">Popular Tags</h4>
                                        <div className="tagcloud">
                                            <Link href="#">Art  Design</Link>
                                            <Link href="#">Courses</Link>
                                            <Link href="#">Education</Link>
                                            <Link href="#">App</Link>
                                            <Link href="#">Video</Link>
                                            <Link href="#">UX Course</Link>
                                            <Link href="#">Learning</Link>
                                            <Link href="#">Programming</Link>
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