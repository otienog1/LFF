import { useEffect, useRef } from "react"
import Container from "./Container"
import gsap from "gsap"

const TheTeam = ({ title, trustees }) => {
    const elem = useRef(null)

    let newTrustees = Object.entries(trustees[0])
    newTrustees.shift()

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    })

    return (
        <section className="flex justify-end bg-lff_100 py-40 text-lff_800 relative px-4 md:px-0">
            <Container>
                <>
                    <h4 className="text-sm uppercase font-bold" dangerouslySetInnerHTML={{ __html: title[0] }}></h4>
                    <h2 className="text-5xl md:text-7xl font-bold my-20" dangerouslySetInnerHTML={{ __html: title[1] }}></h2>
                    <div className="flex flex-wrap" ref={elem}>
                        {newTrustees.map((trustee, i) => <Trustee trustee={trustee[1]} key={i} />)}
                    </div>
                </>
            </Container>
        </section>
    )
}

const Trustee = ({ trustee }) => {

    let webp = trustee[0].thumb.sourceUrl

    let jpeg = webp.split('.')
    jpeg = `${jpeg[0]}.${jpeg[1]}.jpg`

    let imageFallback
    if (typeof window !== 'undefined')
        imageFallback = document.querySelector('.imageFallback')

    const resetModal = (modal, overlay) => {
        gsap.set(modal, {
            bottom: 'unset',
            top: 0
        })
        gsap.set(overlay, {
            yPercent: 0
        })
    }

    const handleClick = () => {
        let modal = document.querySelector('.theTeam')
        let overlay = document.querySelector('.overlayMember')

        gsap.timeline({
            onComplete: () => resetModal(modal, overlay)
        })
            .to(overlay, {
                duration: .5,
                yPercent: -100,
                ease: 'power.in'
            })
            .to(overlay, {
                duration: .5,
                yPercent: -205,
                ease: 'power.out'
            })
            // .to(imageFallback, {
            //     duration: .5,
            //     scale: 1
            // })
            .set(modal, {
                height: '100%',
            }, .5)
    }

    return (
        <>
            <div className="member w-1/2 md:w-1/3 pr-6 pb-8 z-50 cursor-pointer" onClick={() => handleClick()}>
                <div className="w-full">
                    <picture className="picture">
                        <source srcSet={webp} type="image/webp" />
                        <source srcSet={jpeg} type="image/jpeg" />
                        <img src={jpeg} />
                    </picture>
                </div>
                <span className="name text-lg font-bold mt-4 mb-0 flex" dangerouslySetInnerHTML={{ __html: trustee[0].name }}></span>
                <span className="title text-sm flex" dangerouslySetInnerHTML={{ __html: trustee[0].title }}></span>
                <div className="content text-sm hidden" dangerouslySetInnerHTML={{ __html: trustee[0].text1 }}></div>
            </div>
        </>
    )
}

export default TheTeam