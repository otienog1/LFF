import { useEffect, useRef } from "react"
import Container from "./Container"
import gsap from "gsap"

const TheTeam = ({ title, trustees }) => {
    const elem = useRef(null)

    let newTrustees = Object.entries(trustees[0])
    newTrustees.shift()

    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('.picture'), { background: true }, resolve)
        })
    }

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`

        preloadImages().then(() => {
            gsap.to(document.querySelectorAll('.picture'), {
                duration: .5,
                opacity: 1,
                ease: 'power3.inOut'
            })
        })
    })

    return (
        <section className="flex justify-end bg-lff_900 py-28 md:py-40 text-lff_100 relative px-4 md:px-0">
            <Container>
                <>
                    <h4 className="text-sm" dangerouslySetInnerHTML={{ __html: title[0] }}></h4>
                    <h2 className="text-5xl md:text-7xl font-bold my-20 tracking-widest text-lff_400" dangerouslySetInnerHTML={{ __html: title[1] }}></h2>
                    <div className="flex flex-wrap" ref={elem}>
                        {newTrustees.map((trustee, i) => <Trustee trustee={trustee[1]} key={i} />)}
                    </div>
                </>
            </Container>
        </section>
    )
}

const Trustee = ({ trustee }) => {
    const elem = useRef(null),
        image = useRef(null)

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

    useEffect(() => {
        // elem.current.style.height = `${image.current.offsetHeight}px`
    }, [])

    return (
        <>
            <div ref={elem} className="member relative w-1/2 md:w-1/3 px-3 mb-6 z-50 cursor-pointer" onClick={() => handleClick()}>
                <div ref={image} className="w-full">
                    <img className="w-full" src={trustee[0].thumb.sourceUrl} />
                </div>
                <div className="">
                    <span className="name block text-xl font-bold mb-0 mt-4 leading-tight" dangerouslySetInnerHTML={{ __html: trustee[0].name }}></span>
                    <span className="title text-sm text-center flex" dangerouslySetInnerHTML={{ __html: trustee[0].title }}></span>
                </div>
                <div ref={image} className="picture hidden">
                    <img className="w-full" src={trustee[0].image.sourceUrl} />
                </div>
                <div className="content text-sm hidden" dangerouslySetInnerHTML={{ __html: trustee[0].text1 }}></div>
            </div>
        </>
    )
}

export default TheTeam