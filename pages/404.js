import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Custom404() {

    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Error Page">
                <section className="error-area">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="error-wrap text-center">
                                    <div className="error-img">
                                        <img src="/assets/img/others/error_img.svg" alt="img" />
                                    </div>
                                    <div className="error-content">
                                        <h2 className="title">ERROR PAGE! <span>Sorry! This Page is Not Available!</span></h2>
                                        <div className="tg-button-wrap">
                                            <Link href="/" className="btn tg-svg"><span className="text">Go To Home APge</span> <span className="svg-icon" id="error-btn" data-svg-icon="assets/img/icons/btn-arrow.svg" /></Link>
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