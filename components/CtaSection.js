import { useEffect, useRef } from "react"
import Container from "./Container"
import Link from "next/link"

const CtaSection = ({ image, title, content }) => {
    const elem = useRef(null)
    const ctaImage = useRef(null)

    useEffect(() => {
        window.addEventListener('load', () => {
            elem.current.style.paddingTop = `${80 + ctaImage.current.offsetHeight * 2 / 3}px`
            ctaImage.current.style.top = `-${ctaImage.current.offsetHeight * 1 / 3}px`
        })
    }, [])
    return (
        <section className="flex justify-center bg-lffgreen_500">
            <Container>
                <div ref={elem} className="py-20 w-full mx-auto relative">
                    <div ref={ctaImage} className="w-3/5 absolute mx-auto z-20 left-1/2 -translate-x-1/2 overflow-hidden">
                        <img data-scroll-speed="100" src={image} className="object-cover w-full h-full" />
                    </div>
                    <div className="md:w-4/5 mx-auto">
                        <p className="font-extrabold text-5xl text-center text-lffvegas_500" dangerouslySetInnerHTML={{
                            __html: title
                        }}></p>
                        <p className="text-center text-lff_400 text-2xl my-16" dangerouslySetInnerHTML={{ __html: content }}></p>
                    </div>
                    <div className="flex justify-center">
                        <Link href="/donate">
                            <a className="inline-block border-2 border-lffvegas px-16 py-4 font-verl font-bold text-lff_200">DONATE</a>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default CtaSection