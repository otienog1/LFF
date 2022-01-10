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
                <div ref={elem} className="block  py-48 px-4 md:px-0">

                    <div className='block md:flex justify-between w-full h-full items-center'>
                        <div className="hidden md:block w-4/12 overflow-hidden">
                            <img src={image} className="w-full" />
                        </div>
                        <div className="w-full md:w-7/12">
                            <h2 className="text-xs mb-10 font-bold uppercase tracking-widest">beliefs</h2>
                            <h2 className="text-5xl mb-10 font-extrabold">{title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: content }} className="text-normal"></div>
                        </div>
                        <div className="block md:hidden w-full overflow-hidden mt-8 pr-4">
                            <img src={image} className="w-full" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Philosophy