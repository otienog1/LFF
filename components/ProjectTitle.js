const ProjectTitle = ({ children }) => (
    <h1
        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight md:leading-none text-center font-sorts capitalize text-lff_800"
        dangerouslySetInnerHTML={{ __html: children }}
    />
)

export default ProjectTitle