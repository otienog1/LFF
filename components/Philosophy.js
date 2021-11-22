import Container from '../components/Container'

import { useRef, useEffect } from 'react'

const Philosophy = ({ image, title, content }) => {
    const elem = useRef(null)

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    return (
        <section className="flex w-full bg-lff_400 text-lff_800 justify-end">
            <Container>
                <div ref={elem} className="flex justify-between w-full h-full items-center py-28">
                    <div className="w-5/12">
                        <img src={image} className="w-full" />
                    </div>
                    <div className="w-6/12">
                        <h2 className="text-3xl font-bold mb-5">{title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: content }} className="text-xl"></div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Philosophy