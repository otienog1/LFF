import ProjectPreview from './ProjectPreview'
import Container from './Container'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const MoreProjects = ({ projects }) => {
    const elem = useRef(null)

    useEffect(() => {

        let children = [...elem.current.children]

        children.map((child, i) => {

            let image = child.getElementsByTagName('img')
            let text = child.getElementsByTagName('span')

            let childAnim = gsap.to(child, {
                duration: .75,
                background: '#FFECBC',
                ease: 'power3.inOut',
                paused: true
            })

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
                color: '#665F4B',
                ease: 'power3.inOut',
                paused: true
            })

            child.addEventListener("mouseenter", () => {
                img.play()
                txt.play()
                childAnim.play()
            })
            child.addEventListener("mouseleave", () => {
                img.reverse()
                txt.reverse()
                childAnim.reverse()
            })
        })
    }, [])
    return (
        <Container>
            <h3 className='text-5xl mb-20 text-lff_100 tracking-wider font-bold'>More projects</h3>
            <div ref={elem}>
                {projects.map(project => (
                    <ProjectPreview
                        key={project.slug}
                        title={project.title}
                        coverImage={project.image}
                        slug={project.slug}
                    />
                ))}
            </div>
        </Container>
    )
}

export default MoreProjects