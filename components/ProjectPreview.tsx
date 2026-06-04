'use client'

import Link from 'next/link'

const ProjectPreview = ({ title, coverImage, slug, }) => {



    return (
        <div className='flex w-full h-52 mb-6 rounded overflow-hidden bg-lff_600'>
            <div className="w-1/2 h-full overflow-hidden">
                <Link href={`/projects/${slug}`} scroll={false} className="flex w-full h-full">
                    <img
                        className='w-full object-cover h-full scale-105'
                        alt={title}
                        src={coverImage.sourceUrl}
                    />
                </Link>
            </div>
            <div className='w-1/2'>
                <Link href={`/projects/${slug}`} scroll={false} className="flex w-full h-full items-center pl-8 md:pl-16">
                    <span className="flex text-xl md:text-3xl text-lff_100 leading-snug capitalize font-bold">
                        {title}
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default ProjectPreview