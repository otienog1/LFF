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
        <section className="flex justify-center bg-lff_900">
            <Container>
                <div ref={elem} className="pb-28 md:py-0 w-full mx-auto relative md:px-0">
                    <div ref={ctaImage} className="w-full md:w-3/5 mx-auto overflow-hidden relative md:-top-60">
                        <div className="overflow-hidden mb-10 md:mb-28">
                            <img src={image} className="object-cover w-full" />
                        </div>
                        <div className="md:w-full mx-auto px-4">
                            <p className="font-extrabold text-5xl text-center text-lffvegas_500" dangerouslySetInnerHTML={{
                                __html: title
                            }}></p>
                            <p className="text-center text-lff_400 text-2xl my-16" dangerouslySetInnerHTML={{ __html: content }}></p>
                        </div>
                        <div className="flex justify-center relative">
                            <Link href="/donate">
                                <a className="inline-block px-16 py-5 bg-lffvegas_300 font-bold text-lff_800 cursor-pointer hover:bg-lffvegas_500 transition-all text-sm tracking-widest">SEND A DONATION</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default CtaSection