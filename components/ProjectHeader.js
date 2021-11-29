import { useEffect, useRef } from "react";
import CoverImage from "./CoverImage";
import ProjectTitle from './ProjectTitle'

const ProjectHeader = ({ title, coverImage, date, categories, }) => {
    const elem = useRef(null)
    useEffect(() => {
        elem.current.style.height = `${document.documentElement.clientHeight * .85}px`
    }, [])
    return (
        <>
            <div ref={elem} className="flex">
                <div className="md:w-1/2 m-auto">
                    <ProjectTitle>{title}</ProjectTitle>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <CoverImage title={title} coverImage={coverImage} />
            </div>
        </>
    )
}

export default ProjectHeader