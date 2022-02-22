import CoverImage from "./CoverImage"
import Link from "next/link"
import Container from "./Container"
import { useEffect, useRef } from "react"
import gsap from "gsap"

const HeroProject = ({ projects, title }) => {
    const elem = useRef(null)

    useEffect(() => {

        let children = [...elem.current.children]

        children.map((child, i) => {

            let image = child.getElementsByTagName('img')
            let text = child.getElementsByTagName('span')

            let img = gsap.to(image, {
                duration: .75,
                rotate: 0,
                scale: 1,
                opacity: 1,
                ease: 'power3.inOut',
                paused: true
            })

            let txt = gsap.to(text, {
                duration: .75,
                opacity: 1,
                marginLeft: 0,
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
        <div className="flex w-full justify-center px-6 md:px-0">
            <Container>
                <h3 dangerouslySetInnerHTML={{ __html: title }} className='text-lff_100 text-5xl lowercase text-center font-bold tracking-widest mb-28'></h3>
                <div
                    ref={elem}
                    className="columns-2 gap-8 mx-auto space-y-8 pb-28"
                >
                    {projects.map((project, i) => (
                        <div
                            className="flex w-full items-center overflow-hidden rounded-sm"
                            key={i}
                        >
                            {
                                project.image && (
                                    <Link as={`/projects/${project.slug}`} href="/projects/[slug]" scroll={false}>
                                        <a className="block w-full relative">
                                            <img
                                                title={project.title}
                                                src={project.image.sourceUrl}
                                                className="w-full object-fill h-full scale-105 rotate-2"
                                            />
                                            <span
                                                className="opacity-0 block absolute bottom-4 md:bottom-8 font-extrabold text-lff_100 text-3xl md:text-4xl tracking-wider px-16 ml-2"
                                            >{project.title}</span>
                                        </a>
                                    </Link>
                                )
                            }
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default HeroProject