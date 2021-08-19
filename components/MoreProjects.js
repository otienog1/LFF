import ProjectPreview from './ProjectPreview'

const MoreProjects = ({ projects }) => (
    <section>
        <div
            className="px-4 grid grid-cols-1 md:grid-cols-2 md:col-gap-16 lg:col-gap-32 row-gap-20 md:row-gap-32 mb-32"
        >
            {projects.map(({ node }) => (
                <ProjectPreview
                    key={node.slug}
                    title={node.title}
                    coverImage={node.featuredImage?.node}
                    date={node.date}
                    slug={node.slug}
                    excerpt={node.excerpt}
                />
            ))}
        </div>
    </section>
)

export default MoreProjects