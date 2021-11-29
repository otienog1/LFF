import { useEffect, useRef } from 'react'
import Container from './Container'

const Luigi = ({ title, images, text, text1, text2 }) => {
    const elem = useRef()

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])
    return (
        <section className="flex justify-end py-28 md:py-80 text-lff_800 text-lg bg-lff_100 px-4 md:px-0">
            <Container>
                <div ref={elem}>
                    <div className="block md:flex justify-between items-center">
                        <div className="w-full md:w-2/5 mb-10 md:mb-0">
                            <h1 dangerouslySetInnerHTML={{ __html: title }} className="font-extrabold text-3xl mb-5"></h1>
                            <p dangerouslySetInnerHTML={{ __html: text }}></p>
                        </div>
                        <div className="w-full md:w-2/5 pr-5">
                            <img src={images[0].image1.sourceUrl} className="w-full" />
                        </div>
                    </div>
                    <div className="block md:flex justify-between items-center py-10 md:py-80">
                        <div className="block md:hidden w-full mb-16 md:w-2/5">
                            <p dangerouslySetInnerHTML={{ __html: text1 }}></p>
                        </div>
                        <div className="w-full md:w-2/5 overflow-hidden mb-16 md:mb-0">
                            <img data-scroll-speed="100" src={images[0].image2.sourceUrl} className="w-full" />
                        </div>
                        <div className="hidden md:block w-full md:w-2/5">
                            <p dangerouslySetInnerHTML={{ __html: text1 }}></p>
                        </div>
                    </div>
                    <div className="pt-0 pb-0 md:pb-96">
                        <p dangerouslySetInnerHTML={{ __html: text2 }} className="text-2xl leading-normal text-center"></p>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Luigi