
const ProjectBody = ({ content }) => (
    <div className="max-w-2xl mx-auto">
        <div
            className=""
            dangerouslySetInnerHTML={{ __html: content }}
        />
    </div>
)

export default ProjectBody