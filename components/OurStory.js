import Container from '../components/Container'

import { useRef, useEffect } from 'react'
import Link from 'next/link'

const OurStory = ({ title, intro, content, image }) => {
    const elem = useRef(null)

    useEffect(() => {
        // elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    return (
        <section className="flex h-screen w-full bg-lffvegas_300 text-lff_800 justify-end">
            <Container>
                <div className="flex w-full h-full items-center py-20">
                    <div className="w-5/12 pr-24">
                        <h3 className="text-sm uppercase font-bold font-sen">{title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: intro }} className="text-3xl font-extrabold my-16"></div>
                        <div dangerouslySetInnerHTML={{ __html: content }} className="text-xl"></div>
                        <div>
                            <Link href="/our-story">
                                <a
                                    className="mt-16 inline-block px-16 py-4 bg-lffvegas_600 text-lff_200 font-sen shadow"
                                >Our Story</a>
                            </Link>
                        </div>
                    </div>
                    <div className="w-7/12">
                        <div>
                            <img src={image} className="w-full" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default OurStory