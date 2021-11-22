import Container from "./Container"

const ProjectBody = ({ content }) => (
    <div className="">
        <div
            className="text-lg text-primary"
            dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="hidden py-20 w-3/5 z-10 mt-5">
            <div className="xl:w-1/2 z-20 justify-between flex-1 space-x-8 mt-20 w-full md:w-auto md:ml-4 px-6 pt-6 md:pt-0 md:px-0 md:mt-0 absolute md:absolute">
                <div className="mt-6 pt-20 md:space-x-8 md:flex"></div>
            </div>
        </div>
    </div>
)

export default ProjectBody