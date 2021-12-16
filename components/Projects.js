import { useEffect, useRef } from "react"
import Container from "./Container"
const Projects = ({ projects, text, title }) => {
    const elem = useRef(null)
    let works = Object.values(projects[0])
    works.shift()

    useEffect(() => {
        // elem.current.style.height = `${elem.current.children[0].offsetHeight}px`
        // elem.current.style.width = `${elem.current.children[0].offsetWidth}px`
    }, [])

    return (
        <section className="flex justify-center flex-wrap bg-lff_200 md:min-h-screen text-lff_800 py-28">
            <Container>
                <div className="md:w-full px-4 md:px-0 md:mb-48 leading-loose text-xl">
                    <h2 className="text-3xl mb-20 text-center" >— {title} —</h2>
                    <div className='md:w-1/2 mx-auto text-center text-lg mb-28'>
                        <p dangerouslySetInnerHTML={{ __html: text }}></p>
                    </div>
                    <div className='flex lg:space-x-6 flex-wrap lg:flex-nowrap'>
                        {works.map((work, i) => (
                            <div ref={elem} className='relative w-full lg:w-1/4 overflow-hidden mb-5' key={i}>
                                <span className="block font-bold text-lff_800 text-2xl mb-10 w-1/2">{work.text}</span>
                                <img className="w-full object-fill" src={work.image.sourceUrl} />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Projects