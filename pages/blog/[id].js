import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import data from "../../util/blog.json"

export default function BlogDetails() {
    let Router = useRouter()
    const [blogPost, setBlogPost] = useState(null)
    const { id } = Router.query

    useEffect(() => {
        setBlogPost(data.find((data) => data.id == id))
    }, [id])

    return (
        <>
            {blogPost && (
                <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Blog Details">
                    <section className="blog-standard-area section-py-120">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="blog__standard-post blog__details-wrapper">
                                        <div className="blog__standard-thumb">
                                            <img src={`/assets/img/blog/${blogPost.img}`} className="w-100" alt="img" />
                                        </div>
                                        <div className="blog__standard-content blog-details-content">
                                            <h3 className="title">{blogPost.title}</h3>
                                            <ul className="list-wrap blog__post-meta">
                                                <li><i className="flaticon-account" /> by <Link href="#">Admin</Link></li>
                                                <li><i className="flaticon-calendar-date" /> 23 Aug, 2023</li>
                                                <li><i className="flaticon-help" /> 22 Comments</li>
                                            </ul>
                                            <p>Horem ipsum dolor sitter metting Great consectetur adipiscing idealorem ipsum dolor sitter mettingtablished of a page when lookinThe point of using Lorem Ipsu ss normal distribution.est, qui dolor emr ipsum quia dolor sit ame consec tetur. Esse mo lestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et ac cumsan et iusto odio dignissim qui blandit praesent consectetur adipiscing idealorem.</p>
                                            <blockquote>
                                                <p>“ urabitur varius eros rutrum consequat Mauris sollicitudin enim condimentum luctus enim justo non molestie nisl ”</p>
                                            </blockquote>
                                            <h4 className="inner-title">During this program</h4>
                                            <p>Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec odio aea the dumm ipsumm ipsum that dolocons rsus mal suada and fadolorit.</p>
                                            <div className="event-details-list">
                                                <ul className="list-wrap">
                                                    <li><i className="fas fa-check-circle" />Become a UX designer.</li>
                                                    <li><i className="fas fa-check-circle" />Create quick wireframes.</li>
                                                    <li><i className="fas fa-check-circle" />You will be able to add UX designe</li>
                                                    <li><i className="fas fa-check-circle" />Downloadable exercise files</li>
                                                    <li><i className="fas fa-check-circle" />Become a UI designer.</li>
                                                </ul>
                                            </div>
                                            <p>Horem ipsum dolor sitter metting Great consectetur adipiscing idealorem ipsum dolor sitter mettingtablished of a page when lookinThe point of using Lorem Ipsu ss normal distribution.est, qui dolor emr ipsum quia dolor sit ame consec tetur. Esse mo lestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et ac cumsan et iusto odio dignissim qui blandit praesent consectetur adipiscing idealorem.</p>
                                            <div className="blog-details-bottom">
                                                <div className="row">
                                                    <div className="col-xl-6 col-md-7">
                                                        <div className="tg-post-tag">
                                                            <h5 className="tag-title">Tags :</h5>
                                                            <ul className="list-wrap p-0 mb-0">
                                                                <li><Link href="#">Art  Design</Link></li>
                                                                <li><Link href="#">Video</Link></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-6 col-md-5">
                                                        <div className="tg-post-social justify-content-start justify-content-md-end">
                                                            <h5 className="social-title">Social Share :</h5>
                                                            <ul className="list-wrap p-0 mb-0">
                                                                <li><Link href="#"><i className="fab fa-facebook-f" /></Link></li>
                                                                <li><Link href="#"><i className="fab fa-twitter" /></Link></li>
                                                                <li><Link href="#"><i className="fab fa-linkedin-in" /></Link></li>
                                                                <li><Link href="#"><i className="fab fa-pinterest-p" /></Link></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog__next-prev mb-50">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="blog__prev-item">
                                                    <div className="blog__prev-thumb">
                                                        <Link href="/blog-details">
                                                            <img src="/assets/img/blog/blog_standard04.jpg" alt="img" />
                                                        </Link>
                                                    </div>
                                                    <div className="blog__prev-content">
                                                        <span className="caption">Previous Post</span>
                                                        <h5 className="title"><Link href="/blog-details">Future Plan  Strategy for
                                                            Construe Architecture</Link></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="blog__prev-item next">
                                                    <div className="blog__prev-thumb">
                                                        <Link href="/blog-details">
                                                            <img src="/assets/img/blog/blog_standard03.jpg" alt="img" />
                                                        </Link>
                                                    </div>
                                                    <div className="blog__prev-content">
                                                        <span className="caption">Next Post</span>
                                                        <h5 className="title"><Link href="/blog-details">The Growing Need For Effective Password</Link></h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog__post-author">
                                        <div className="blog__post-author-thumb">
                                            <Link href="#"><img src="/assets/img/blog/author.png" alt="img" /></Link>
                                        </div>
                                        <div className="blog__post-author-content">
                                            <span className="designation">Written by</span>
                                            <h5 className="name">Parker Willy</h5>
                                            <p>Finanappreciate your trust greatly Our clients choose dentace ducts because kneer areawe
                                                ow we are the best area Awaitingare really.</p>
                                        </div>
                                    </div>
                                    <div className="blog-post-comment">
                                        <div className="comment-wrap">
                                            <div className="comment-wrap-title">
                                                <h4 className="title">02 Comments</h4>
                                            </div>
                                            <div className="latest-comments">
                                                <ul className="list-wrap">
                                                    <li>
                                                        <div className="comments-box">
                                                            <div className="comments-avatar">
                                                                <img src="/assets/img/blog/comment01.png" alt="img" />
                                                            </div>
                                                            <div className="comments-text">
                                                                <div className="avatar-name">
                                                                    <h6 className="name">Alebary Keon</h6>
                                                                    <span className="date">December 27, 2023</span>
                                                                </div>
                                                                <p>Finanappreciate your trust greatly Our clients choose dentace ducts because know we are the best area Awaitingare really.</p>
                                                                <div className="comment-reply">
                                                                    <Link href="#" className="comment-reply-link">Reply</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="comments-box">
                                                            <div className="comments-avatar">
                                                                <img src="/assets/img/blog/comment02.png" alt="img" />
                                                            </div>
                                                            <div className="comments-text">
                                                                <div className="avatar-name">
                                                                    <h6 className="name">Lukas Javeb</h6>
                                                                    <span className="date">December 27, 2023</span>
                                                                </div>
                                                                <p>Finanappreciate your trust greatly Our clients choose dentace ducts because know we are the best area Awaitingare really.</p>
                                                                <div className="comment-reply">
                                                                    <Link href="#" className="comment-reply-link">Reply</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="comment-respond">
                                            <h4 className="comment-reply-title">Post a Comment</h4>
                                            <form action="#" className="comment-form">
                                                <p className="comment-notes">
                                                    <span>Your email address will not be published. Required fields are marked *</span>
                                                </p>
                                                <div className="comment-field">
                                                    <textarea placeholder="Enter your comment" />
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <div className="comment-field">
                                                            <input type="text" placeholder="Name" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="comment-field">
                                                            <input type="email" placeholder="Email" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="comment-field">
                                                            <input type="text" placeholder="Website" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="form-submit" />
                                                <button className="btn">Post Comment</button>
                                            </form>
                                        </div>
                                    </div>
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
            )}
        </>
    )
}