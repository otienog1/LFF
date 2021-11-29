import Container from "./Container"
import Link from "next/link"
import { useRef, useEffect } from "react"
import gsap from "gsap"

const HeroSection = ({ intro, slides, thumbs }) => {
    const elem = useRef(null)

    useEffect(() => {
        elem.current.style.height = `${document.documentElement.clientHeight - document.querySelector('.slider-thumb').offsetHeight}px`
    })

    return (
        <section ref={elem} className="flex justify-end relative">
            <Container>
                <div className="flex">
                    <div className=" flex w-4/12 items-center">
                        <div className="w-full">
                            <h1 className="font-sorts text-4xl 2xl:text-5xl text-lff_800 mb-8" dangerouslySetInnerHTML={{ __html: intro }}></h1>
                            <Link href="/donate">
                                <a className="font-verl text-lffvegas_600 text-lg text-bold underline">Help us save the earth</a>
                            </Link>
                        </div>
                    </div>

                    <HeroSlider
                        slides={slides}
                        thumbs={thumbs}
                        autoplay={!0}
                        direction="next"
                        speed={2}
                        duration={7}
                        current={0}
                        RAF={0}
                    />

                </div>
            </Container>
        </section>
    )
}

const HeroSlider = props => {
    let { slides, thumbs, autoplay, direction, speed, duration, current } = props,
        next = current + 1,
        thumbCurrent = next,
        thumbNext = thumbCurrent + 1

    const bullets = useRef()
    const bullet = gsap.utils.selector(bullets)
    const sliders = useRef()
    const slider = gsap.utils.selector(sliders)
    const thumbnails = useRef()
    const thumbnail = gsap.utils.selector(thumbnails)

    let newSlides = Object.entries(slides),
        newThumbs = Object.entries(thumbs)
    newSlides.shift()
    newThumbs.shift()

    const initSlide = () => {
        slider('.slide').forEach(slider => {
            slider.style.zIndex = 1
        });

        thumbnail('.thumb').forEach(thumb => {
            thumb.style.zIndex = 1
        })

        sliders.current.children[next].style.zIndex = 2
        sliders.current.children[current].style.zIndex = 3
        sliders.current.children[current].style.opacity = 1

        thumbnails.current.children[thumbNext].style.zIndex = 2
        thumbnails.current.children[thumbCurrent].style.zIndex = 3
        thumbnails.current.children[thumbCurrent].style.opacity = 1

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
        })

        gsap.to(sliders.current.children[next], {
            duration: speed,
            opacity: 1,
        })

        gsap.to(thumbnails.current.children[thumbCurrent], {
            duration: speed,
            opacity: 0,
        })

        gsap.to(thumbnails.current.children[thumbNext], {
            duration: speed,
            opacity: 1,
        })
        getSlide()
    }

    const setSlide = () => {

        bullet('.list__item').forEach(bullet => {
            bullet.classList.remove("is__active")
        })
        bullet('.list__item')[next].classList.add("is__active");
        slider('.slide').forEach(slider => {
            slider.style.zIndex = 1
        });
        thumbnail('.thumb').forEach(slider => {
            slider.style.zIndex = 1
        })
        sliders.current.children[next].style.zIndex = 3
        sliders.current.children[current].style.zIndex = 2
        thumbnails.current.children[thumbNext].style.zIndex = 3
        thumbnails.current.children[thumbCurrent].style.zIndex = 2
    }

    const getSlide = () => {
        "next" === direction ? nextSlide() : prevSlide()
    }

    const nextSlide = () => {
        current === sliders.current.children.length - 1 ? current = 0 : current = next
        next === sliders.current.children.length - 1 ? next = 0 : next = current + 1

        thumbCurrent === thumbnails.current.children.length - 1 ? thumbCurrent = 0 : thumbCurrent = thumbNext
        thumbNext === thumbnails.current.children.length - 1 ? thumbNext = 0 : thumbNext = thumbCurrent + 1
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
        thumbnail('.thumb').forEach((thumb, i) => {
            thumb.addEventListener('click', () => {
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
        sliders.current.style.height = `${(document.documentElement.clientHeight - 160)}px`
        thumbnails.current.style.width = `${(document.querySelector('.donate-btn').offsetWidth)}px`
        bullets.current.parentElement.style.right = `${(document.querySelector('.donate-btn').offsetWidth + 20)}px`
        initSlide()
        return
    }, [])

    return (
        <>
            <div ref={sliders} className="w-8/12 relative overflow-hidden">
                {newSlides.map((slide, i) => <Slide source={slide[1].sourceUrl} key={i} />)}
            </div>
            <div className="absolute bottom-6 z-50">
                <ul className="flex" ref={bullets}>
                    {newSlides.map((_, i) => <Bullet key={i} />)}
                </ul>
            </div>
            <div ref={thumbnails} className="slider-thumb absolute bottom-0 right-0 h-20 w-80 z-50 cursor-pointer">
                {newThumbs.map((thumb, i) => <Thumb key={i} source={thumb[1].sourceUrl} />)}
            </div>
        </>
    )
}

const Slide = ({ source }) => (
    <div data-scroll-speed="100" className="slide absolute w-full h-full top-0 opacity-0">
        <div className="w-full h-full">
            <img src={source} className="w-full h-full object-cover" />
        </div>
    </div>
)

const Thumb = ({ source }) => (
    <div className="thumb absolute h-full w-full top-0 left-0">
        <div className="h-full w-full">
            <img src={source} className="w-full h-full object-cover" />
        </div>
    </div>
)

const Bullet = () => (
    <li className="list__item w-6 h-6 block cursor-pointer relative rounded-full mr-4 opacity-50 before:absolute before:bg-lff_600">
        <svg className="top-0 left-0 w-full h-full absolute rotate-90" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.08 28.08" xmlSpace="preserve">
            <circle style={{ fill: 'none' }} className="stroke-1 stroke-current text-lffgreen" cx="14.04" cy="14.04" r="13.54"></circle>
        </svg>
    </li>
)

export default HeroSection