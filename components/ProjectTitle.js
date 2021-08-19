const ProjectTitle = ({ children }) => (
    <h1
        className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center font-sorts capitalize"
        dangerouslySetInnerHTML={{ __html: children }}
    />
)

export default ProjectTitle