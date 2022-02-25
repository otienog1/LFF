import { useEffect, useRef } from 'react'
import Container from './Container'

const Luigi = ({ title, images, text, text1, text2 }) => {
    const elem = useRef()

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])
    return (
        <section className="flex justify-end py-28 md:py-40 md:pb-96 text-lff_800 text-lg bg-lff_100 px-4 md:px-0">
            <Container>
                <div className='flex' ref={elem}>
                    <div className="hidden md:flex w-full md:w-2/5 items-center flex-col">
                        <div className="w-full overflow-hidden mb-16">
                            <img src={images[0].image1.sourceUrl} className="w-full" />
                        </div>
                        <div className="w-full overflow-hidden">
                            <img src={images[0].image2.sourceUrl} className="w-full" />
                        </div>
                    </div>
                    <div className="block md:flex w-full md:w-1/2 items-center justify-end">
                        <div className='w-full md:w-4/5'>
                            <div className="w-full mb-10 md:mb-0 text-base">
                                <h3 className="text-sm mb-10 capitalize">{title} —</h3>
                                <h1 dangerouslySetInnerHTML={{ __html: 'Luigi Francescon' }} className="text-5xl font-extrabold mb-20"></h1>
                                <p dangerouslySetInnerHTML={{ __html: text }}></p>
                            </div>
                            <div className="w-full block md:hidden overflow-hidden mb-16">
                                <img src={images[0].image1.sourceUrl} className="w-full" />
                            </div>
                            <div className="block md:hidden w-full mb-16 text-base">
                                <p dangerouslySetInnerHTML={{ __html: text1 }}></p>
                            </div>
                            <div className="block md:hidden w-full overflow-hidden mb-16">
                                <img src={images[0].image2.sourceUrl} className="w-full" />
                            </div>
                            <div className="hidden md:block w-full my-16 text-base">
                                <p dangerouslySetInnerHTML={{ __html: text1 }}></p>
                            </div>
                            <div className="">
                                <p dangerouslySetInnerHTML={{ __html: text2 }} className="text-2xl leading-normal"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Luigi