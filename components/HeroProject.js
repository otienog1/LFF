import Date from "./Date";
import CoverImage from "./CoverImage";
import Link from "next/link";

const HeroProject = (
    {
        title,
        coverImage,
        date,
        excerpt,
        slug,
    }
) => (
    <section>
        <div className="mb-8 md:mb-16 px-4">
            {coverImage && (
                <CoverImage title={title} coverImage={coverImage} slug={slug} />
            )}
        </div>
        <div className="px-4 md:grid md:grid-cols-2 md:col-gap-16 lg:col-gap-8 mb-20 md:mb-28">
            <div>
                <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
                    <Link as={`/projects/${slug}`} href="/projects/[slug]">
                        <a
                            className="hover:underline"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    </Link>
                </h3>
                <div className="mb-4 md:mb-0 text-lg">
                    <Date dateString={date} />
                </div>
            </div>
            <div>
                <div
                    className="text-lg leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />
            </div>
        </div>
    </section>
)

export default HeroProject