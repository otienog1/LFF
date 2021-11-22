import { useEffect, useRef } from "react"
import Container from "./Container"

const Intro = () => {
    const elem = useRef(null)
    useEffect(() => {
        elem.current.style.height = `${document.documentElement.clientHeight * .8}px`
    }, [])
    return (
        <section ref={elem} className="px-6 lg:px-0 flex w-full screen h-screen justify-center">
            <Container>
                <div className="flex flex-col h-full">
                    <div className="xl:w-1/3 m-auto">
                        <div className="">
                            <h1 className="text-center text-5xl md:text-left md:text-6xl leading-tight font-bold text-lff_800 tracking-wider">
                                OUR PROJECTS
                            </h1>
                            <h4 className="md:text-left leading-relaxed text-xl mt-24 font-sorts text-lff_800">
                                Maniago Safaris, through our Luigi Footprints Foundation, are working on several projects to help support  Wildlife Conservation efforts, the environment and Community projects, especially with the youth
                            </h4>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Intro