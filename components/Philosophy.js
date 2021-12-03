import Container from '../components/Container'

import { useRef, useEffect } from 'react'

const Philosophy = ({ image, title, content }) => {
    const elem = useRef(null)

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    return (
        <section className="flex w-full bg-lff_400 text-lff_800 justify-end pt-28 md:pt-0">
            <Container>
                <div ref={elem} className="block md:flex justify-between w-full h-full items-center py-28 px-4 md:px-0">
                    <div className="hidden md:block w-5/12 overflow-hidden">
                        <img data-scroll-speed="100" src={image} className="w-full" />
                    </div>
                    <div className="w-full md:w-6/12">
                        <h2 className="text-3xl font-bold mb-5">{title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: content }} className="text-xl"></div>
                    </div>
                    <div className="block md:hidden w-full overflow-hidden mt-8 pr-4">
                        <img data-scroll-speed="100" src={image} className="w-full" />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Philosophy