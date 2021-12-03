import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

const TeamMember = () => {
    const [trustee, setTrustee] = useState({})
    const elem = useRef(null),
        overlay = useRef(null),
        imageFallback = useRef(null)

    const modal = useRef(null)

    const resetModal = () => {
        gsap.set(modal.current, {
            top: 'unset',
            bottom: 0,
        })
        gsap.set(overlay.current, {
            yPercent: 100
        })
    }

    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelector('.html-5-picture'), { background: true }, resolve)
        })
    }

    useEffect(() => {
        let member = document.querySelectorAll('.member')
        member.forEach((m, i) => {
            let picture = m.querySelector('.picture').children[0].srcset
            let name = m.querySelector('.name').innerHTML
            let title = m.querySelector('.title').innerHTML
            let content = m.querySelector('.content').innerHTML


            let pic = picture.split('_')[0]


            m.addEventListener('click', () => {
                setTrustee({
                    webp: `${pic}.webp`,
                    jpeg: `${pic}.jpg`,
                    name: name,
                    title: title,
                    content: content,
                })
            })

            preloadImages().then(() => {
                gsap.to(imageFallback.current, {
                    duration: 1,
                    opacity: 1,
                    ease: 'Power3.inOut'
                })
            })
        })

        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
        elem.current.style.paddingLeft = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    const handleClose = () => {
        gsap.timeline({
            onComplete: () => resetModal()
        })
            .to(overlay.current, {
                duration: .5,
                yPercent: -100,
                ease: 'power.in'

            })
            .to(overlay.current, {
                duration: .5,
                yPercent: -205,
                ease: 'power.out'
            })
            .set(modal.current, {
                height: 0,
            }, .5)
    }

    return (
        <>
            <div ref={modal} className="theTeam flex w-screen h-0 bg-lff_100 fixed bottom-0 left-0 z-50 overflow-hidden">
                <div className="w-1/2 overflow-hidden">
                    <picture className="html-5-picture">
                        <source srcSet={trustee.webp} />
                        <source srcSet={trustee.jpeg} />
                        <img ref={imageFallback} src={trustee.jpeg} className="imageFallback opacity-0" />
                    </picture>
                </div>
                <div ref={elem} className="w-1/2 py-40 text-lff_800 md:pl-20">
                    <h2 className="font-bold text-4xl" dangerouslySetInnerHTML={{ __html: trustee.name }}></h2>
                    <h4 className="text-lff_700 font-bold mt-2" dangerouslySetInnerHTML={{ __html: trustee.title }}></h4>
                    <div className="h-3/4 mt-20 text-xl overflow-y-auto" dangerouslySetInnerHTML={{ __html: trustee.content }}>
                    </div>
                </div>
                <div className="absolute top-8 right-8 md:top16 md:right-16 cursor-pointer" onClick={() => handleClose()}>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.4533 39.5467L39.5466 24.4534" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M39.5466 39.5467L24.4533 24.4534" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24 58.6667H40C53.3333 58.6667 58.6666 53.3334 58.6666 40V24C58.6666 10.6667 53.3333 5.33337 40 5.33337H24C10.6666 5.33337 5.33331 10.6667 5.33331 24V40C5.33331 53.3334 10.6666 58.6667 24 58.6667Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <div ref={overlay} className="overlayMember fixed top-full left-0 w-screen h-screen bg-lff_400 z-50"></div>
        </>
    )
}

export default TeamMember