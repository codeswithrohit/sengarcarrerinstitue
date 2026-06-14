import Layout from "@/components/layout/Layout"
import { useState } from "react"

export default function Faq() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    })

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Find Answers Here">
                <section className="faq-area section-py-120">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10">
                                <div className="faq-wrap">
                                    <div className="accordion" id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(1)}>
                                                <button  className={isActive.key == 1 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    What is Learn Well System?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 1 ? "accordion-collapse collapse show" : "accordion-collapse collapse"}data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(2)}>
                                                <button  className={isActive.key == 2 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    What is included in Standard membership plan?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 2 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(3)}>
                                                <button  className={isActive.key == 3 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    How to choose the right class for me?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 3 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(4)}>
                                                <button  className={isActive.key == 4 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                    Can I pause my Premium membership plan any time?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 4 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(5)}>
                                                <button  className={isActive.key == 5 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                    How does th Affiliate Program work?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 5 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(6)}>
                                                <button  className={isActive.key == 6 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                                    How we provide services for you?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 6 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(7)}>
                                                <button  className={isActive.key == 7 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                                                    Where can I download the LearnWell app?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 7 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" onClick={() => handleToggle(8)}>
                                                <button  className={isActive.key == 8 ? "accordion-button  collapsed" : "accordion-button"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                                                    How we became best among others?
                                                </button>
                                            </h2>
                                            <div  className={isActive.key == 8 ? "accordion-collapse collapse show" : "accordion-collapse collapse"} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>Sorem ipsum dolor sit amet consectetur adipiscing elit massa aenean orci erat pellentesque areaultrices idposere interdum est proin lacus acilisis faucibus egestas fringilla dolor tellus sit venenatis lorem ipsumaw dolor onsectur.Sorem ipsum dolor sit amet consectetu.</p>
                                                </div>
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