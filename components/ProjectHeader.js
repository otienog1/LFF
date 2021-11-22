import { useEffect, useRef } from "react";
import Date from "./Date";
import CoverImage from "./CoverImage";
import ProjectTitle from './ProjectTitle'
import Categories from './Categories'

const ProjectHeader = ({ title, coverImage, date, categories, }) => {
    const elem = useRef(null)
    useEffect(() => {
        elem.current.style.height = `${document.documentElement.clientHeight * .7}px`
    }, [])
    return (
        <>
            <div ref={elem} className="flex">
                <div className="md:w-1/2 m-auto">
                    <ProjectTitle>{title}</ProjectTitle>
                </div>
            </div>

            <div className="">
                <CoverImage title={title} coverImage={coverImage} />
            </div>
        </>
    )
}

export default ProjectHeader