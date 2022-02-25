import Container from "./Container"
import Logo from "./Logo"

const Intro = ({ title, text }) => {
    return (
        <section className="bg-lff_600">
            <Logo />
            <div className="h-screen">
                <div className="flex h-1/3 md:h-1/2 justify-center items-end md:mb-20">
                    <Container>
                        <h1
                            className="capitalize text-5xl md:text-7xl text-lff_400 text-center tracking-widest font-bold"
                            dangerouslySetInnerHTML={{ __html: title }}>
                        </h1>
                    </Container>
                </div>
                <div className="flex md:justify-center md:min-h-screen">
                    <Container>
                        <div className="flex md:h-2/3 items-center">
                            <div className="h-full flex items-start w-full -translate-y-1/5 relative">
                                <p
                                    className="text-2xl md:text-3xl text-lff_100 leading-loose w-full mt-16 tracking-wider px-8 md:px-0"
                                    dangerouslySetInnerHTML={{ __html: text }}
                                ></p>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        </section>
    )
}

export default Intro