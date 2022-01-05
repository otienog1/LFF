import Link from "next/link"
import Container from "./Container"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
const Projects = ({ projects, text, title }) => {
    const elem = useRef(null)
    let works = Object.values(projects[0])
    works.shift()


    useEffect(() => {

        let children = [...elem.current.children]

        // children.



        children.map((child, i) => {

            let image = child.getElementsByTagName('img')
            let text = child.getElementsByTagName('span')

            let img = gsap.to(image, {
                duration: .75,
                rotate: 0,
                opacity: 1,
                scale: 1,
                ease: 'power3.inOut',
                paused: true
            })

            let txt = gsap.to(text, {
                duration: .75,
                color: 'white',
                ease: 'power3.inOut',
                paused: true
            })

            child.addEventListener("mouseenter", () => {
                img.play()
                txt.play()
            })
            child.addEventListener("mouseleave", () => {
                img.reverse()
                txt.reverse()
            })
        })
    }, [])

    return (
        <section className="flex justify-end flex-wrap bg-lff_100 text-lff_800 border-b border-lff_600">
            <Container>
                <div className="flex md:w-full px-4 md:px-0 items-center leading-loose">
                    <div className="w-2/5">
                        <h5 className="text-sm uppercase font-bold tracking-widest">projects</h5>
                        <h2 className="text-5xl font-extrabold my-10 tracking-wider" dangerouslySetInnerHTML={{ __html: title }}></h2>
                        <div className='md:w-full text-base pr-20'>
                            <p dangerouslySetInnerHTML={{ __html: text }}></p>
                        </div>
                    </div>
                    <div ref={elem} className='picture flex w-3/5 h-full flex-wrap'>
                        {works.map((work, i) => (
                            <div className='relative w-1/2 overflow-hidden border-b border-l border-lff_600 third-child:border-b-0 last:border-b-0' key={i}>
                                <Link href={''}>
                                    <a className="flex project">
                                        <span className="block text-lff_800 text-3xl leading-tight tracking-widest w-1/2 absolute bottom-8 left-4 underline-offset-8 z-50" dangerouslySetInnerHTML={{ __html: work.text }}></span>
                                        <img className="w-full object-fill h-full opacity-0 scale-105 rotate-3" src={work.image.sourceUrl} />
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Projects