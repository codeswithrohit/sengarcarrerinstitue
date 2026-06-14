
import dynamic from 'next/dynamic'
const PortfolioFilter1 = dynamic(() => import('../elements/PortfolioFilter1'), {
    ssr: false,
})

export default function Course1({courses}) {
    return (
        <>
            <section className="courses-area section-pt-12 section-pb-12 ">
                <div className="container">
                    <PortfolioFilter1 courses={courses} />
                </div>
                <div className="courses__shapes">
                    <div className="courses__shapes-item alltuchtopdown"><img src="/assets/img/courses/course_shape01.png" alt="shape" /></div>
                    <div className="courses__shapes-item alltuchtopdown"><img src="/assets/img/courses/course_shape02.png" alt="shape" /></div>
                </div>
            </section>
        </>
    )
}
