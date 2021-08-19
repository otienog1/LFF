import Date from "./Date";
import CoverImage from "./CoverImage";
import ProjectTitle from './ProjectTitle'
import Categories from './Categories'

const ProjectHeader = (
    {
        title,
        coverImage,
        date,
        categories,
    }
) => (
    <>
        <ProjectTitle>{title}</ProjectTitle>
        <div className="mb-8 md:mb-16 sm:mx-0">
            <CoverImage title={title} coverImage={coverImage} />
        </div>
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-lg">
                Posted <Date dateString={date} />
                <Categories categories={categories} />
            </div>
        </div>
    </>
)

export default ProjectHeader