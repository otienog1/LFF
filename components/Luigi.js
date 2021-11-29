import { useEffect, useRef } from 'react'
import Container from './Container'

const Luigi = ({ title, images, text, text1, text2 }) => {
    const elem = useRef()

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])
    return (
        <section className="flex justify-end py-80 text-lff_800 text-lg bg-lff_100">
            <Container>
                <div ref={elem}>
                    <div className="flex justify-between items-center">
                        <div className="md:w-2/5">
                            <h1 dangerouslySetInnerHTML={{ __html: title }} className="font-extrabold text-3xl mb-5"></h1>
                            <p dangerouslySetInnerHTML={{ __html: text }}></p>
                        </div>
                        <div data-scroll-speed="150" className="md:w-2/5 pr-5">
                            <img src={images[0].image1.sourceUrl} className="w-full" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-80">
                        <div className="md:w-2/5 overflow-hidden">
                            <img data-scroll-speed="100" src={images[0].image2.sourceUrl} className="w-full" />
                        </div>
                        <div className="md:w-2/5">
                            <p dangerouslySetInnerHTML={{ __html: text1 }}></p>
                        </div>
                    </div>
                    <div className="pt-0 pb-96">
                        <p dangerouslySetInnerHTML={{ __html: text2 }} className="text-2xl leading-normal text-center"></p>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Luigi