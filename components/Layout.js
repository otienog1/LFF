import { useEffect, useRef } from 'react'
import Footer from './Footer'
import Header from './Header'
import Meta from './Meta'
import { MobileNav } from './Navbar'
import TeamMember from './TeamMember'
import gsap from 'gsap'

const Layout = ({ children }) => {
    const Main = useRef(null),
        scroller = useRef(null),
        Body = useRef(null),
        noise = useRef(null)

    useEffect(() => {

        const scrollsp = document.querySelectorAll('[data-scroll-speed]')

        const MathUtils = {
            map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
            lerp: (a, b, n) => (1 - n) * a + n * b
        }

        let body = Body.current

        let winsize
        const calcWinsize = () => winsize = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        calcWinsize()
        window.addEventListener('resize', calcWinsize)

        let docScroll;
        const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop
        window.addEventListener('scroll', getPageYScroll)


        class Item {
            constructor(el) {
                this.el = el
                this.renderedStyles = {
                    translationY: {
                        previous: 0,
                        current: 0,
                        ease: .075,
                        maxValue: parseInt(this.el.dataset.scrollSpeed, 10),
                        setValue: () => {
                            const maxValue = this.renderedStyles.translationY.maxValue,
                                minValue = -1 * maxValue
                            return Math.max(
                                Math.min(
                                    MathUtils.map(
                                        this.props.top - docScroll,
                                        winsize.height,
                                        -1 * this.props.height,
                                        minValue,
                                        maxValue
                                    ), maxValue
                                ), minValue
                            )
                        }
                    }
                }
                this.update()

                this.observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0)
                })

                this.observer.observe(this.el)

                this.initEvents()
            }

            update() {
                this.getSize()

                for (const key in this.renderedStyles) {
                    this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue()
                }

                this.layout()
            }

            getSize() {
                const rect = this.el.getBoundingClientRect()
                this.props = {
                    height: rect.height,
                    top: docScroll + rect.top
                }
            }

            initEvents() {
                window.addEventListener('resize', () => this.resize())
            }

            resize() {
                this.update()
            }

            render() {
                for (const key in this.renderedStyles) {
                    this.renderedStyles[key].current = this.renderedStyles[key].setValue()
                    this.renderedStyles[key].previous = MathUtils.lerp(
                        this.renderedStyles[key].previous,
                        this.renderedStyles[key].current,
                        this.renderedStyles[key].ease
                    )

                    this.layout()
                }

            }
            layout() {
                this.el.style.transform = `translate3d(0,${this.renderedStyles.translationY.previous}px,0)`
            }
        }

        const SmoothScroll = () => {
            const main = Main.current,
                scrollable = scroller.current

            let items = []

            scrollsp.forEach(item => items.push(new Item(item)))

            let renderedStyles = {
                translationY: {
                    previous: 0,
                    current: 0,
                    ease: 0.075,
                    setValue: () => docScroll
                }
            }

            setSize()
            update()
            style()
            initEvents()
            requestAnimationFrame(() => render())

            function update() {
                for (const key in renderedStyles) {
                    renderedStyles[key].current = renderedStyles[key].previous = renderedStyles[key].setValue()
                }

                layout()
            }

            function layout() {
                scrollable.style.transform = `translate3d(0,${-1 * renderedStyles.translationY.previous}px,0)`
            }

            function setSize() {
                body.style.height = noise.current.style.height = `${scrollable.scrollHeight}px`
            }

            function style() {
                main.style.position = 'fixed'
                main.style.width = main.style.height = '100%'
                main.style.top = main.style.left = 0
                main.style.overflow = 'hidden'
            }

            function initEvents() {
                window.addEventListener('resize', () => setSize())
            }

            function render() {
                for (const key in renderedStyles) {
                    renderedStyles[key].current = renderedStyles[key].setValue()
                    renderedStyles[key].previous = MathUtils.lerp(
                        renderedStyles[key].previous,
                        renderedStyles[key].current,
                        renderedStyles[key].ease
                    )
                }
                layout()

                for (const item of items) {
                    if (item.isVisible) {
                        item.render()
                    }
                }

                requestAnimationFrame(() => render())
            }
        }

        const preloadImages = () => {
            return new Promise((resolve, reject) => {
                imagesLoaded(document.querySelectorAll('body'), { background: true }, resolve)
            })
        }

        preloadImages().then(() => {
            // body.classList.remove('loading')

            gsap.to(body, {
                duration: .2,
                opacity: 1,
                ease: 'power3.inOut'
            })

            getPageYScroll()
            new SmoothScroll()
        })
    }, [])

    return (

        <div className="font-sorts antialiased">
            <Meta />
            <div ref={Body} className="bg-lff_200 loading">
                <main ref={Main}>
                    <MobileNav />
                    <div ref={scroller} className="relative" >
                        <Header />
                        {children}
                        <Footer />
                        <div ref={noise} className="main absolute hidden md:block w-full top-0 left-0"></div>
                    </div>
                </main>
            </div>
            <TeamMember />
        </div>

    )
}

export default Layout