import { useEffect, useRef } from "react"
import Container from "./Container"
import Link from "next/link"

const CtaSection = ({ image, title, content }) => {
    const elem = useRef(null)
    const parent = useRef(null)

    useEffect(() => {
        elem.current.style.height = `${10 + elem.current.parentElement.offsetHeight * 2 / 3}px`
    }, [])
    return (
        <section className="flex justify-center">
            <div className="relative w-full">
                <div ref={parent} className="relative w-full">
                    <div className="w-2/5 relative mx-auto z-20">
                        <img src={image} className="object-cover w-full h-full" />
                    </div>
                    <div ref={elem} className="w-full bg-lffgreen_500 absolute top-1/3 z-10"></div>
                </div>
                <div className="flex justify-center w-full bg-lffgreen_500">
                    <Container>
                        <div className="py-20 w-2/3 mx-auto">
                            <p className="font-extrabold text-5xl text-center text-lffvegas_500" dangerouslySetInnerHTML={{
                                __html: title
                            }}></p>
                            <p className="text-center text-lff_400 text-2xl my-16" dangerouslySetInnerHTML={{ __html: content }}></p>
                            <div className="flex justify-center">
                                <Link href="/donate">
                                    <a className="inline-block border-2 border-lffvegas px-16 py-4 font-verl font-bold text-lff_200">DONATE</a>
                                </Link>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            {/* <div></div> */}
        </section>
    )
}

export default CtaSection