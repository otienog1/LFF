import Head from 'next/head'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { getOurStory } from '../../lib/pages'
import TheTeam from '../../components/TheTeam'

const Index = ({ page }) => {


    return (
        <>
            <Layout>
                <Head>
                    <title>Our Story | The Luigi Footprints</title>
                </Head>
                <section className="flex md:justify-center md:min-h-screen">
                    <Container>
                        <div className="h-1/2 flex items-center w-full justify-center">
                            <h1 className="text-5xl md:text-6xl text-lff_800 text-center font-extrabold tracking-wider">Our Story</h1>
                        </div>
                    </Container>
                </section>
                <TheTeam title={[page.title1, page.title2]} trustees={page.trustees} />
            </Layout>
        </>
    )
}

export async function getStaticProps() {
    const page = await getOurStory()

    return {
        props: {
            page: page.page
        }
    }
}

export default Index