import cn from 'classnames'
import Link from 'next/link'

const CoverImage = ({ title, coverImage, slug }) => {
    const image = (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            src={coverImage?.sourceUrl}
            className={cn('shadow-small rounded-lg md:rounded-none', {
                'hover:shadow-medium transition-shadow duration-200': slug,
            })}
            alt={title}
        />)

    return (
        <div className="">
            {slug ? (
                <Link as={`/projects/${slug}`} href="/projects/[slug]">
                    <a aria-label={title}>{image}</a>
                </Link>
            ) : (
                image
            )}
        </div>
    )
}

export default CoverImage