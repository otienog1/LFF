import { useEffect, useRef } from "react"
import Container from "./Container"
const Projects = ({ projects, text, title }) => {
    const elem = useRef(null)
    let works = Object.values(projects[0])
    works.shift()

    useEffect(() => {
        elem.current.style.height = `${elem.current.children[0].offsetHeight}px`
        // elem.current.style.width = `${elem.current.children[0].offsetWidth}px`
    }, [])

    return (
        <section className="flex justify-center flex-wrap items-center bg-lff_200 md:min-h-screen text-lff_800 py-28">
            <Container>
                <div className="md:w-full px-4 md:px-0 md:mb-48 leading-loose text-xl">
                    <h2 className="text-3xl mb-20 text-center" >— {title} —</h2>
                    <div className='md:w-1/2 mx-auto md:text-center text-lg mb-28'>
                        <p dangerouslySetInnerHTML={{ __html: text }}></p>
                    </div>
                    <div className='flex lg:space-x-6'>
                        {works.map((work, i) => (
                            <div ref={elem} className='relative w-full lg:w-1/4 overflow-hidden' key={i}>
                                <img className="w-full absolute object-fill" src={work.image.sourceUrl} />
                                <span className="absolute bottom-4 font-bold text-lff_100 px-4 tracking-wide text-3xl">{work.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Projects