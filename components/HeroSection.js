import LFFLogo from './LFFLogo'
import Link from 'next/link'
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { isMobile } from './Layout'

const HeroSection = ({ intro, slides, text }) => {
    const elem = useRef(null)

    useEffect(() => {
        // elem.current.style.height = `${document.documentElement.clientHeight - document.querySelector('.slider-thumb').offsetHeight}px`
    })

    return (
        <section ref={elem} className="flex justify-end relative">
            <div className="w-full">
                <div className="block md:flex">
                    {/* <div className="flex w-full md:w-4/12 items-center">
                        <div className="px-4 md:px-0 w-full py-8 md:py-0">
                            <h1 className="font-sorts text-4xl 2xl:text-5xl text-lff_800 mb-8" dangerouslySetInnerHTML={{ __html: intro }}></h1>
                            <Link href="/donate">
                                <a className="font-verl text-center text-lffvegas_600 text-lg text-bold underline">Help us save the earth</a>
                            </Link>
                        </div>
                    </div> */}

                    <HeroSlider
                        slides={slides}
                        text={text}
                        autoplay={!0}
                        direction="next"
                        speed={2}
                        duration={10}
                        current={0}
                        RAF={0}
                    />
                </div>
            </div>
        </section>
    )
}

const HeroSlider = props => {
    let { slides, text, autoplay, direction, speed, duration, current } = props,
        next = current + 1

    const bullets = useRef(null)
    const bullet = gsap.utils.selector(bullets)
    const sliders = useRef(null)
    const slider = gsap.utils.selector(sliders)
    const textWrapper = useRef(null)
    const textWrappers = gsap.utils.selector(textWrapper)
    const indicator = useRef(null)
    const logo = useRef(null)

    let newSlides = Object.entries(slides)
    newSlides.shift()

    let textArr = Object.values(text)
    textArr.shift()

    const initSlide = () => {
        slider('.slide').forEach(slider => {
            slider.style.zIndex = 1
        });

        sliders.current.children[next].style.zIndex = 2
        sliders.current.children[current].style.zIndex = 3
        sliders.current.children[current].style.opacity = 1

        textWrapper.current.children[next].style.opacity = 0
        textWrapper.current.children[current].style.opacity = 1

        bullets.current.children[current].classList.add("is__active")
        startAutoplay();
        clickEvent();
    }

    const startAutoplay = () => {
        autoplay = !0
        !0 === autoplay && gsap.delayedCall(duration, play)
    }

    const stopAutoplay = () => {
        autoplay = !1
        gsap.killTweensOf(play)
    }

    const play = () => {
        tweenSlide()
        !0 === autoplay && gsap.delayedCall(duration, play)
    }

    const tweenSlide = () => {
        setSlide()
        gsap.to(sliders.current.children[current], {
            duration: speed,
            opacity: 0,
            ease: 'power3.inOut'
        })

        gsap.to(sliders.current.children[next], {
            duration: speed,
            opacity: 1,
            ease: 'power3.inOut'
        })

        gsap.to(textWrapper.current.children[current], {
            duration: 2,
            opacity: 0,
            ease: 'power3.inOut'
        })

        gsap.to(textWrapper.current.children[next], {
            duration: 2,
            opacity: 1,
            ease: 'power3.inOut'
        })
        getSlide()
    }

    const setSlide = () => {

        bullet('.list__item').forEach(bullet => {
            bullet.classList.remove("is__active")
        })

        bullet('.list__item')[next].classList.add("is__active")

        slider('.slide').forEach(slider => {
            slider.style.zIndex = 1
        });

        sliders.current.children[next].style.zIndex = 3
        sliders.current.children[current].style.zIndex = 2

        textWrappers('.slideText').forEach(tt => {
            tt.style.opacity = 0
        });

        textWrapper.current.children[next].style.opacity = 0
        textWrapper.current.children[current].style.opacity = 1
    }

    const getSlide = () => {
        "next" === direction ? nextSlide() : prevSlide()
    }

    const nextSlide = () => {
        current === sliders.current.children.length - 1 ? current = 0 : current = next
        next === sliders.current.children.length - 1 ? next = 0 : next = current + 1
    }

    const prevSlide = () => {

    }

    const clickEvent = (e) => {
        bullet('.list__item').forEach((bullet, i) => {
            bullet.addEventListener('click', () => {
                direction = "next"
                stopAutoplay()
                next = i
                tweenSlide()
                current = i
                startAutoplay()
            })
        })
    }


    useEffect(() => {

        sliders.current.style.height = `${(document.documentElement.clientHeight - 35)}px`

        if (!isMobile()) {
            bullets.current.parentElement.style.right = `${(document.querySelector('.donate-btn').offsetWidth + 20)}px`
            textWrapper.current.style.left = `${(document.documentElement.clientWidth - (document.documentElement.clientWidth * .91666667)) / 2}px`
            indicator.current.style.left = `${(document.documentElement.clientWidth - (document.documentElement.clientWidth * .91666667)) / 2}px`
            logo.current.style.left = `${(document.documentElement.clientWidth - (document.documentElement.clientWidth * .91666667)) / 2}px`
        }

        initSlide()

        window.addEventListener('scroll', () => {
            if (window.scrollY >= 10) {
                gsap.to(logo.current, {
                    duration: .5,
                    opacity: 0,
                    ease: 'power3.inOut'
                })
            }
            else {
                gsap.to(logo.current, {
                    duration: .5,
                    opacity: 1,
                    ease: 'power3.inOut'
                })
            }
        })
        return
    }, [])

    return (
        <>
            <div ref={sliders} className="w-full md:w-full relative overflow-hidden">
                {newSlides.map((slide, i) => <Slide source={slide[1].sourceUrl} key={i} />)}
            </div>
            <div className="absolute bottom-10 z-50 left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0">
                <ul className="flex" ref={bullets}>
                    {newSlides.map((_, i) => <Bullet key={i} />)}
                </ul>
            </div>
            <div ref={textWrapper} className="flex items-end absolute top-0 w-full lg:w-1/4 h-full z-10 lg:ml-24 pb-20 px-4">
                {textArr.map((txt, i) => <Text key={i} heading={txt[0].heading} explainer={txt[0].explainer} />)}
            </div>
            <span ref={indicator} className="hidden lg:block icon-scroll-line h-1/3"></span>
            <span ref={logo} className='absolute top-10 z-50 hidden lg:block'>
                <Link href={'/'}>
                    <a>
                        <LFFLogo width="225" height="130" fill="#FFFBF2" />
                    </a>
                </Link>
            </span>
        </>
    )
}

const Slide = ({ source }) => (
    <div className="slide absolute w-full h-full top-0 opacity-0">
        <div className="w-full h-full">
            <img src={source} className="w-full h-full object-cover" />
        </div>
    </div>
)

const Text = ({ heading, explainer }) => (
    <div className="slideText absolute  w-full opacity-0">
        <div className="h-full w-full text-lff_100">
            <h2 className="text-4xl 2xl:text-5xl font-extrabold capitalize leading-tight" dangerouslySetInnerHTML={{ __html: heading }}></h2>
            <p className="text-xl tracking-wide mt-10" dangerouslySetInnerHTML={{ __html: explainer }}></p>
        </div>
    </div>
)

const Bullet = () => (
    <li className="list__item w-6 h-6 block cursor-pointer relative rounded-full mr-4 opacity-50 before:absolute before:bg-lff_200">
        <svg className="top-0 left-0 w-full h-full absolute rotate-90" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.08 28.08" xmlSpace="preserve">
            <circle style={{ fill: 'none' }} className="stroke-2 stroke-current text-lff_100" cx="14.04" cy="14.04" r="10.54"></circle>
        </svg>
    </li>
)

export default HeroSection