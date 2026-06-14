import BlogPost from "@/components/blog/BlogPost"
import Layout from "@/components/layout/Layout"

export default function Blog() {
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="title">
                <BlogPost showItem={6} style={1} showPagination />
            </Layout>
        </>
    )
}