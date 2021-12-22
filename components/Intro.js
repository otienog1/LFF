import { useEffect, useRef } from "react"
import Container from "./Container"

const Intro = () => {
    const elem = useRef(null)
    useEffect(() => {
        elem.current.style.height = `${document.documentElement.clientHeight * .8}px`
    }, [])
    return (
        <section ref={elem} className="px-6 lg:px-0 flex w-full min-h-screen justify-center">
            <Container>
                <div className="flex flex-col h-full">
                    <div className="md:w-2/3 m-auto">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-9xl leading-tight font-bold text-lff_800 tracking-tight">
                                OUR PROJECTS
                            </h1>
                            <h4 className="leading-relaxed text-2xl mt-24 font-sorts text-lff_800">
                                Maniago Safaris, through our Luigi Footprints Foundation, are working on several projects to help support  Wildlife Conservation efforts, the environment and Community projects, especially with the youth.
                            </h4>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Intro