import { useEffect, useRef } from "react"
import Container from "./Container"
import Link from "next/link"

const CtaSection = ({ image, title, content }) => {
    const elem = useRef(null)
    const ctaImage = useRef(null)

    useEffect(() => {
        // elem.current.style.paddingTop = `${80 + ctaImage.current.offsetHeight * 2 / 3}px`
        // ctaImage.current.style.top = `-${ctaImage.current.offsetHeight * 1 / 3}px`
    }, [])
    return (
        <section className="flex justify-center bg-lffgreen_500">
            <Container>
                <div ref={elem} className="py-28 md:py-0 w-full mx-auto relative px-4 md:px-0">
                    <div ref={ctaImage} className="w-full md:w-3/5 mx-auto overflow-hidden relative md:-top-60">
                        <div className="overflow-hidden mb-10 md:mb-28">
                            <img data-scroll-speed="100" src={image} className="object-cover w-full" />
                        </div>
                        <div className="md:w-full mx-auto">
                            <p className="font-extrabold text-5xl text-center text-lffvegas_500" dangerouslySetInnerHTML={{
                                __html: title
                            }}></p>
                            <p className="text-center text-lff_400 text-2xl my-16" dangerouslySetInnerHTML={{ __html: content }}></p>
                        </div>
                        <div className="flex justify-center relative">
                            <Link href="/donate">
                                <a className="inline-block rounded-sm px-16 py-3 bg-lffvegas_300 font-bold text-lff_800 cursor-pointer hover:bg-lffvegas_500 transition-all">DONATE</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default CtaSection