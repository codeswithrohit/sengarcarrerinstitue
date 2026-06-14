import Link from "next/link"
import Slider from "react-slick"

const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    arrows: false,
    slidesToShow: 6,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                infinite: true,
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
            }
        },
    ]
}

export default function BrandSlider1() {
    return (
        <>
            <Slider {...settings} className="row brand-active">
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand01.png" alt="brand" /></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand02.png" alt="brand" /></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand03.png" alt="brand" /></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand04.png" alt="brand" /></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand05.png" alt="brand" /></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand06.png" alt="brand" /></Link>
                    </div>
                </div>
                <div className="col">
                    <div className="brand__item">
                        <Link href="#"><img src="/assets/img/brand/brand07.png" alt="brand" /></Link>
                    </div>
                </div>
            </Slider>
        </>
    )
}
