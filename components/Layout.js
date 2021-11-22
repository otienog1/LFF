import { useEffect, useRef } from 'react'
import Footer from './Footer'
import Header from './Header'
import Meta from './Meta'
import TeamMember from './TeamMember'

const Layout = ({ children }) => {
    const Main = useRef(null),
        scroller = useRef(null),
        Body = useRef(null),
        noise = useRef(null)

    useEffect(() => {
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

        const SmoothScroll = () => {
            const main = Main.current,
                scrollable = scroller.current

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

                requestAnimationFrame(() => render())
            }
        }

        const preloadImages = () => {
            return new Promise((resolve, reject) => {
                imagesLoaded(document.querySelectorAll('body'), { background: true }, resolve)
            })
        }

        preloadImages().then(() => {
            body.classList.remove('loading')

            getPageYScroll()
            new SmoothScroll()
        })
    }, [])

    return (

        <div className="font-sorts antialiased">
            <Meta />
            <div ref={Body} className="bg-lff_200 loading">
                <Header />
                <main ref={Main}>
                    <div ref={scroller} className="relative" >
                        {children}
                        <Footer />
                        <div ref={noise} className="main absolute w-full top-0 left-0"></div>
                    </div>
                </main>
            </div>
            <TeamMember />
        </div>

    )
}

export default Layout