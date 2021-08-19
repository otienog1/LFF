import Date from './Date'
import CoverImage from './CoverImage'
import Link from 'next/link'

const ProjectPreview = (
    {
        title,
        coverImage,
        date,
        excerpt,
        slug,
    }
) => (
    <>
        <div className="mb-5">
            <CoverImage title={title} coverImage={coverImage} slug={slug} />
        </div>
        <h3 className="text-3xl mb-3 leading-snug">
            <Link as={`/projects/${slug}`} href="/projects/[slug]">
                <a
                    className="hover:underline"
                    dangerouslySetInnerHTML={{ __html: title }}
                ></a>
            </Link>
        </h3>
        <div className="text-lg mb-4">
            <Date dateString={date} />
        </div>
        <div
            className="text-lg leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: excerpt }}
        />
    </>
)

export default ProjectPreview