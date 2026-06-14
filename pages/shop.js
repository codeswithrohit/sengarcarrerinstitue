import AllShop from "@/components/courses/AllShop"
import FilterShop from "@/components/courses/FilterShop"
import Layout from "@/components/layout/Layout"

export default function Shop() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop Page">
                <section className="shop-area section-py-120">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-9 order-0 order-lg-2">
                                <div className="shop-item-wrap">
                                    <div className="row justify-content-center">
                                        <AllShop />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-8">
                                <FilterShop />
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}