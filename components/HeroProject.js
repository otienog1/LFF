import { useEffect, useRef } from "react"
import CoverImage from "./CoverImage"
import Link from "next/link"
import Container from "./Container"

const HeroProject = ({ title, coverImage, excerpt, slug, }) => {
    const elem = useRef()

    useEffect(() => {
        elem.current.style.paddingLeft = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    return (
        <div className="flex w-full justify-center px-6 md:px-0">
            <Container>
                <div ref={elem} className="md:flex h-full content-center py-8 md:py-0">
                    <div className="flex w-full md:w-1/2 items-center overflow-hidden">
                        {
                            coverImage && (
                                <CoverImage title={title} coverImage={coverImage} slug={slug} />
                            )
                        }
                    </div>
                    <div className="flex md:pl-16 md:w-1/2 items-center">
                        <div>
                            <h3 className="my-5 md:mt-0 text-2xl leading-tight font-bold">
                                <Link as={`/projects/${slug}`} href="/projects/[slug]">
                                    <a
                                        className="hover:underline capitalize tracking-wider"
                                        dangerouslySetInnerHTML={{ __html: title }}
                                    />
                                </Link>
                            </h3>
                            <div
                                className="flex text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: excerpt }}
                            />
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HeroProject