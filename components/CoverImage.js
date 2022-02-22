import Link from 'next/link'

const CoverImage = ({ title, coverImage, slug }) => {
    let cover = coverImage?.sourceUrl.split('.')
    cover = `${cover.slice(0, -3)}.${cover[cover.length - 3]}.${cover[cover.length - 2]}_cover.${cover[cover.length - 1]}`

    const image = (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            // data-scroll-speed="100"
            src={slug ? cover : coverImage?.sourceUrl}
            className="w-full"
            alt={title}
        />
    )

    return (
        <>
            {slug ? (
                <Link as={`/projects/${slug}`} href="/projects/[slug]">
                    <a aria-label={title} className="block w-full">{image}</a>
                </Link>
            ) : (
                image
            )}
        </>
    )
}

export default CoverImage