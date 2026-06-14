import Layout from "@/components/layout/Layout"
import ShopRelatedSlider1 from "@/components/slider/ShopRelatedSlider1"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import books from "../../data/books.json"

const BookSingle = () => {
    const router = useRouter()
    const [book, setBook] = useState({})
    const id = router.query.id

    useEffect(() => {
        if (!id) <h1>Loading...</h1>
        else setBook(books.find((item) => item.id == id))
        return () => { }
    }, [id])

    const [activeIndex, setActiveIndex] = useState(1)
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }
    const [activeIndex2, setActiveIndex2] = useState(1)
    const handleOnClick2 = (index) => {
        setActiveIndex2(index)
    }
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop Details">
                <section className="shop-details-area section-pt-120 section-pb-90">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="shop-details-images-wrap">
                                    <div className="tab-content" id="myTabContent">
                                        <div className={activeIndex === 1 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <Link href="#" className="popup-image">
                                                <img src="/assets/img/shop/shop_details01.jpg" alt="" />
                                            </Link>
                                        </div>
                                        <div className={activeIndex === 2 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <Link href="#" className="popup-image">
                                                <img src="/assets/img/shop/shop_details02.jpg" alt="" />
                                            </Link>
                                        </div>
                                        <div className={activeIndex === 3 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <Link href="#" className="popup-image">
                                                <img src="/assets/img/shop/shop_details01.jpg" alt="" />
                                            </Link>
                                        </div>
                                    </div>
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" onClick={() => handleOnClick(1)}>
                                            <button className={activeIndex === 1 ? "nav-link active" : "nav-link"}>
                                                <img src="/assets/img/shop/shop_nav01.jpg" alt="" />
                                            </button>
                                        </li>
                                        <li className="nav-item" onClick={() => handleOnClick(2)}>
                                            <button className={activeIndex === 2 ? "nav-link active" : "nav-link"}>
                                                <img src="/assets/img/shop/shop_nav02.jpg" alt="" />
                                            </button>
                                        </li>
                                        <li className="nav-item" onClick={() => handleOnClick(3)}>
                                            <button className={activeIndex === 3 ? "nav-link active" : "nav-link"}>
                                                <img src="/assets/img/shop/shop_nav01.jpg" alt="" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="shop-details-content">
                                    <h2 className="title">{book.courseTitle}</h2>
                                    <div className="product-review">
                                        <div className="rating">
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                            <i className="fas fa-star" />
                                        </div>
                                        <span>( Reviews 5.0 )</span>
                                    </div>
                                    <h3 className="price">$13.00</h3>
                                    <p>Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur Vesti at bulum nec odio aea the dumm summ ipsum that dolocons rsus mal suada and fadolorit to the consectetur elit.</p>
                                    <div className="shop-details-qty">
                                        <span className="title">Quantity</span>
                                        <div className="cart-plus-minus">
                                            <input type="text" />
                                        </div>
                                        <Link href="#" className="cart-btn btn">Add To Cart</Link>
                                        <Link href="#" className="wishlist-btn"><i className="far fa-heart" /></Link>
                                    </div>
                                    <div className="shop-details-bottom">
                                        <ul className="list-wrap">
                                            <li className="sd-sku">
                                                <span className="title">SKU:</span>
                                                <span className="code">#CDP21</span>
                                            </li>
                                            <li className="sd-category">
                                                <span className="title">Categories:</span>
                                                <Link href="#">Business  Marketing</Link>
                                            </li>
                                            <li className="sd-tag">
                                                <span className="title">Tags:</span>
                                                <Link href="#">Coaching,</Link>
                                                <Link href="#">Education</Link>
                                            </li>
                                            <li className="sd-share">
                                                <span className="title">Share This Product:</span>
                                                <Link href="#"><i className="fab fa-facebook-f" /></Link>
                                                <Link href="#"><i className="fab fa-twitter" /></Link>
                                                <Link href="#"><i className="fab fa-instagram" /></Link>
                                                <Link href="#"><i className="fab fa-youtube" /></Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="product-desc-wrap">
                                    <ul className="nav nav-tabs" id="myTab2" role="tablist">
                                        <li className="nav-item" onClick={() => handleOnClick2(1)}>
                                            <button className={activeIndex2 === 1 ? "nav-link active" : "nav-link"}>Description</button>
                                        </li>
                                        <li className="nav-item" onClick={() => handleOnClick2(2)}>
                                            <button className={activeIndex2 === 2 ? "nav-link active" : "nav-link"}>Reviews</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabContent2">
                                        <div className={activeIndex2 === 1 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <p>Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec odio aea the dumm summ ipsum that dolocons rsus mal suada and fadolorit to the consectetur elit. y to follow tutorials, Exercises, and solutions. This course does start from the beginning with very little knowledge and gives a great overview of common tools used for data science and progresses into more.</p>
                                        </div>
                                        <div className={activeIndex2 === 2 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <div className="product-desc-review">
                                                <div className="product-desc-review-title mb-15">
                                                    <h5 className="title">Customer Reviews (0)</h5>
                                                </div>
                                                <div className="left-rc">
                                                    <p>No reviews yet</p>
                                                </div>
                                                <div className="right-rc">
                                                    <Link href="#">Write a review</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="related-product-area">
                            <div className="section__title mb-50">
                                <h2 className="title tg-svg">Related <span className="position-relative"><span className="svg-icon" id="related-title" data-svg-icon="assets/img/icons/title_shape.svg" />products</span></h2>
                            </div>
                            <ShopRelatedSlider1 />
                        </div>
                    </div>
                </section>

            </Layout>
        </>
    )
}

export default BookSingle
