import Head from 'next/head'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE, SEND_EMAIL } from '../../data/contact'
import Alert from '../../components/Alert'

const Index = () => {
    const elem = useRef(null)

    useEffect(() => {
        elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])

    return (
        <>
            <Layout preview>
                <Head>
                    <title>Contact | Luigi Footprints Foundation</title>
                </Head>
                <div className="flex md:justify-end p-6 md:p-0">
                    <Container>
                        <div ref={elem} className="flex flex-col md:flex-row md:h-screen">
                            <div className="flex w-full md:w-1/2 md:h-full relative items-center">
                                <div>
                                    {/* <h2 className="text-base font-verl text-lff_800 mb-10 font-bold">Get In Touch</h2> */}
                                    <h3 className="font-sorts text-4xl md:text-9xl text-lff_800 leading-none">We'd love to hear from you</h3>
                                </div>
                                <div className="hidden md:flex w-3/4 justify-between absolute bottom-10">
                                    <div className="flex space-x-3">
                                        <span>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.6481 4.91018C15.4339 4.91018 15.2245 4.97347 15.0465 5.09205C14.8684 5.21063 14.7296 5.37918 14.6476 5.57637C14.5656 5.77356 14.5442 5.99055 14.586 6.19988C14.6278 6.40922 14.7309 6.60151 14.8824 6.75243C15.0338 6.90336 15.2268 7.00614 15.4368 7.04778C15.6469 7.08942 15.8646 7.06805 16.0625 6.98637C16.2604 6.90469 16.4295 6.76637 16.5485 6.5889C16.6675 6.41143 16.731 6.20279 16.731 5.98935C16.731 5.70314 16.6169 5.42865 16.4138 5.22626C16.2108 5.02388 15.9353 4.91018 15.6481 4.91018ZM19.7993 7.0865C19.7818 6.34035 19.6415 5.60211 19.3842 4.90119C19.1547 4.30147 18.7976 3.75842 18.3374 3.30942C17.8905 2.84846 17.3443 2.49481 16.7401 2.27522C16.0385 2.01096 15.2969 1.86802 14.5471 1.85254C13.5905 1.79858 13.2837 1.79858 10.8291 1.79858C8.37444 1.79858 8.06761 1.79858 7.11103 1.85254C6.36124 1.86802 5.61961 2.01096 4.9181 2.27522C4.31498 2.49703 3.76924 2.85038 3.32079 3.30942C2.85822 3.75473 2.50333 4.29905 2.28298 4.90119C2.01781 5.60026 1.87436 6.33932 1.85883 7.0865C1.80469 8.03977 1.80469 8.34553 1.80469 10.7916C1.80469 13.2378 1.80469 13.5435 1.85883 14.4968C1.87436 15.244 2.01781 15.983 2.28298 16.6821C2.50333 17.2842 2.85822 17.8285 3.32079 18.2739C3.76924 18.7329 4.31498 19.0863 4.9181 19.3081C5.61961 19.5723 6.36124 19.7153 7.11103 19.7307C8.06761 19.7847 8.37444 19.7847 10.8291 19.7847C13.2837 19.7847 13.5905 19.7847 14.5471 19.7307C15.2969 19.7153 16.0385 19.5723 16.7401 19.3081C17.3443 19.0885 17.8905 18.7348 18.3374 18.2739C18.7996 17.8265 19.1571 17.283 19.3842 16.6821C19.6415 15.9812 19.7818 15.2429 19.7993 14.4968C19.7993 13.5435 19.8535 13.2378 19.8535 10.7916C19.8535 8.34553 19.8535 8.03977 19.7993 7.0865ZM18.1749 14.3889C18.1684 14.9597 18.0646 15.5253 17.8681 16.0616C17.724 16.4529 17.4926 16.8066 17.1913 17.0958C16.8986 17.393 16.5444 17.6232 16.1535 17.7703C15.6153 17.9661 15.0478 18.0695 14.4749 18.076C13.5725 18.121 13.2386 18.13 10.8652 18.13C8.49176 18.13 8.15786 18.13 7.25542 18.076C6.66061 18.0871 6.06835 17.9958 5.50469 17.8062C5.13088 17.6516 4.79298 17.422 4.512 17.1317C4.21247 16.8428 3.98394 16.4889 3.8442 16.0975C3.62387 15.5536 3.50167 14.9752 3.48322 14.3889C3.48322 13.4896 3.42908 13.1568 3.42908 10.7916C3.42908 8.42647 3.42908 8.09372 3.48322 7.19442C3.48727 6.61082 3.59418 6.03247 3.79908 5.48574C3.95795 5.10615 4.2018 4.76778 4.512 4.4965C4.78618 4.18729 5.12502 3.94172 5.50469 3.77706C6.05477 3.57925 6.63454 3.47586 7.21932 3.47129C8.12176 3.47129 8.45566 3.41733 10.8291 3.41733C13.2025 3.41733 13.5364 3.41733 14.4388 3.47129C15.0117 3.47784 15.5792 3.58123 16.1174 3.77706C16.5275 3.92873 16.8955 4.17531 17.1913 4.4965C17.487 4.77275 17.7181 5.11049 17.8681 5.48574C18.0687 6.03335 18.1725 6.61147 18.1749 7.19442C18.2201 8.09372 18.2291 8.42647 18.2291 10.7916C18.2291 13.1568 18.2201 13.4896 18.1749 14.3889ZM10.8291 6.1782C9.91383 6.17998 9.01965 6.45206 8.25952 6.96007C7.49939 7.46809 6.90742 8.18923 6.55841 9.03238C6.20939 9.87553 6.119 10.8029 6.29865 11.6972C6.4783 12.5915 6.91992 13.4127 7.56773 14.057C8.21554 14.7013 9.04045 15.1398 9.93824 15.3171C10.836 15.4944 11.7664 15.4025 12.6118 15.053C13.4572 14.7036 14.1797 14.1123 14.688 13.3538C15.1963 12.5953 15.4676 11.7037 15.4676 10.7916C15.4688 10.1847 15.3496 9.58352 15.1168 9.02267C14.884 8.46181 14.5422 7.95236 14.1111 7.52361C13.68 7.09486 13.1682 6.75527 12.6049 6.52437C12.0416 6.29348 11.4381 6.17583 10.8291 6.1782ZM10.8291 13.7863C10.2347 13.7863 9.65371 13.6107 9.15952 13.2816C8.66533 12.9526 8.28016 12.4849 8.05271 11.9377C7.82526 11.3905 7.76574 10.7883 7.8817 10.2074C7.99765 9.62649 8.28386 9.09289 8.70414 8.67408C9.12441 8.25526 9.65987 7.97005 10.2428 7.85449C10.8257 7.73894 11.43 7.79825 11.9791 8.02491C12.5282 8.25157 12.9975 8.63541 13.3277 9.12788C13.658 9.62035 13.8342 10.1993 13.8342 10.7916C13.8342 11.1849 13.7565 11.5743 13.6054 11.9377C13.4544 12.301 13.2331 12.6311 12.954 12.9092C12.675 13.1873 12.3437 13.4079 11.9791 13.5584C11.6145 13.7089 11.2237 13.7863 10.8291 13.7863Z" fill="#3F3F3F" />
                                            </svg>
                                        </span>
                                        <span className="font-verl">Instagram</span>
                                    </div>
                                    <div className="flex space-x-3">
                                        <span>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.6798 4.78431H15.3763V1.92451C14.5549 1.83939 13.7295 1.79737 12.9037 1.79861C10.449 1.79861 8.77049 3.29146 8.77049 6.02535V8.38153H6V11.5831H8.77049V19.7847H12.0915V11.5831H14.8529L15.268 8.38153H12.0915V6.3401C12.0915 5.39583 12.3441 4.78431 13.6798 4.78431Z" fill="#3F3F3F" />
                                            </svg>
                                        </span>
                                        <span className="font-verl">Facebook</span>
                                    </div>
                                    <div className="flex space-x-3">
                                        <span>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20.7484 3.55245C20.7485 3.3936 20.7063 3.23756 20.6262 3.10023C20.5461 2.96289 20.431 2.84916 20.2924 2.77062C20.1539 2.69208 19.9969 2.65153 19.8375 2.65311C19.6781 2.65469 19.522 2.69833 19.385 2.7796C18.8568 3.09291 18.2881 3.33284 17.6948 3.49275C16.8473 2.76812 15.7665 2.37159 14.6499 2.37564C13.4249 2.37705 12.2484 2.85281 11.3688 3.70246C10.4893 4.55211 9.97546 5.70915 9.93592 6.92926C7.52097 6.54549 5.33224 5.2894 3.7871 3.40051C3.694 3.28795 3.57511 3.19935 3.44044 3.14218C3.30577 3.08501 3.15929 3.06095 3.01333 3.07204C2.86746 3.08401 2.72671 3.1312 2.60326 3.20955C2.4798 3.2879 2.37735 3.39503 2.30477 3.52169C1.93254 4.16902 1.71876 4.89471 1.68078 5.63983C1.64281 6.38495 1.78171 7.12849 2.08621 7.81007L2.08445 7.81183C1.94759 7.89583 1.83465 8.01341 1.75642 8.15334C1.67819 8.29326 1.63729 8.45085 1.63764 8.61102C1.63598 8.74315 1.64393 8.87523 1.66143 9.00622C1.75361 10.1378 2.25685 11.197 3.07678 11.9852C3.02116 12.0908 2.98721 12.2064 2.97692 12.3252C2.96663 12.444 2.98021 12.5637 3.01685 12.6772C3.37432 13.7871 4.13452 14.7241 5.14869 15.3049C4.11833 15.7019 3.00578 15.8404 1.90907 15.708C1.70609 15.6826 1.50048 15.7267 1.32596 15.8331C1.15145 15.9395 1.01839 16.1018 0.948621 16.2934C0.878852 16.4851 0.876512 16.6947 0.941984 16.8878C1.00746 17.081 1.13685 17.2462 1.30895 17.3564C3.19513 18.567 5.39129 19.2107 7.63484 19.2104C10.1791 19.2389 12.6614 18.4287 14.6957 16.9059C16.7301 15.383 18.2024 13.2329 18.8836 10.7899C19.2022 9.72567 19.3649 8.62118 19.3665 7.51061C19.3665 7.45177 19.3665 7.39118 19.3656 7.33058C19.8368 6.82421 20.2018 6.2292 20.4393 5.58044C20.6767 4.93168 20.7818 4.24221 20.7484 3.55245ZM17.7643 6.44093C17.6153 6.61661 17.5398 6.84274 17.5537 7.07238C17.5625 7.22077 17.5616 7.37005 17.5616 7.51061C17.5598 8.44907 17.4218 9.38234 17.1518 10.2814C16.5955 12.3601 15.3552 14.1925 13.6297 15.4853C11.9042 16.7781 9.79319 17.4565 7.63484 17.4118C6.85954 17.412 6.0869 17.3212 5.33292 17.1413C6.29439 16.8325 7.19338 16.3565 7.98824 15.7352C8.13463 15.6204 8.24178 15.4632 8.29496 15.2852C8.34815 15.1072 8.34477 14.9172 8.2853 14.7413C8.22582 14.5653 8.11316 14.412 7.96277 14.3023C7.81238 14.1927 7.63163 14.1321 7.44533 14.1289C6.69525 14.1173 5.97898 13.816 5.44745 13.2885C5.58229 13.263 5.71625 13.2314 5.84932 13.1936C6.04426 13.1383 6.21485 13.0193 6.33362 12.8556C6.4524 12.692 6.51245 12.4932 6.50411 12.2914C6.49576 12.0896 6.41951 11.8965 6.28762 11.7431C6.15574 11.5898 5.97589 11.4851 5.77705 11.446C5.34166 11.3603 4.93196 11.1757 4.5798 10.9065C4.22764 10.6374 3.94251 10.2909 3.74657 9.89412C3.90966 9.91631 4.0738 9.93009 4.23832 9.9354C4.43378 9.93834 4.6251 9.87926 4.78464 9.7667C4.94417 9.65413 5.06364 9.49392 5.12578 9.30922C5.18532 9.12285 5.18226 8.92222 5.11705 8.73774C5.05185 8.55327 4.92806 8.39501 4.76445 8.28697C4.36751 8.02344 4.04236 7.66592 3.81812 7.24643C3.59387 6.82694 3.47754 6.35856 3.47953 5.88327C3.47953 5.82355 3.48129 5.76383 3.48482 5.70499C5.50742 7.58476 8.13087 8.69288 10.8929 8.83411C11.0324 8.83959 11.1712 8.81342 11.299 8.75758C11.4268 8.70175 11.5402 8.6177 11.6306 8.5118C11.7201 8.40488 11.7835 8.27871 11.8157 8.14323C11.848 8.00775 11.8482 7.86666 11.8165 7.73106C11.7649 7.51645 11.7386 7.29658 11.7381 7.0759C11.7389 6.30657 12.0459 5.56899 12.5918 5.025C13.1377 4.48101 13.8779 4.17504 14.6499 4.17423C15.0471 4.17317 15.4402 4.25417 15.8044 4.41213C16.1685 4.57009 16.4959 4.80158 16.7658 5.09198C16.8699 5.20356 17.0009 5.28676 17.1464 5.33365C17.2918 5.38054 17.4469 5.38957 17.5969 5.35987C17.9676 5.28798 18.333 5.19115 18.6905 5.07006C18.4466 5.56735 18.135 6.02867 17.7643 6.44093Z" fill="#3F3F3F" />
                                            </svg>
                                        </span>
                                        <span className="font-verl">Twitter</span>
                                    </div>
                                </div>
                            </div>
                            <ContactForm />
                        </div>
                    </Container>
                </div>
            </Layout>
        </>
    )
}

export const ContactForm = () => {
    const [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [message, setMessage] = useState(''),
        [createMessage, { data, loading, error }] = useMutation(CREATE_MESSAGE),
        [alerts, setAlerts] = useState({}),
        [errors, setErrors] = useState(false),
        [sendEmail] = useMutation(SEND_EMAIL)

    if (error) {
        setAlerts({
            type: 'error',
            message: error.message,
            title: 'An error occured!'
        })
        setErrors(true)
    }

    return (
        <div className="flex  md:w-1/2 relative pt-8 md:pt-0 md:pl-20 items-center flex-wrap">
            <form
                className="flex flex-col w-full"
                onSubmit={e => {
                    e.preventDefault()

                    if (!name || name == '', !email || email == '', !message || message == '') {
                        let error = 'All fields are required!'
                        setAlerts({
                            type: 'error',
                            message: [error],
                            title: 'An error occured!'
                        })
                        setErrors(true)
                        return
                    }

                    createMessage({
                        variables: {
                            name: `${name}`,
                            email: email,
                            message: message
                        }
                    })
                    if (data) {
                        setAlerts({
                            type: 'success',
                            message: ['Your message has been sent successfully'],
                            title: 'Message sent!'
                        })
                        sendEmail({
                            variables: {
                                from: `${name} <${email}>`,
                                subject: `New Contact From ${name}`,
                                body: message
                            }
                        }).then(() => {
                            setName('')
                            setEmail('')
                            setMessage('')
                        })
                        setErrors(true)
                    }

                }}>
                {errors ? <Alert alert={alerts} /> : ''}
                <label htmlFor="name" className="font-sorts font-bold mb-2 text-lff_800">Name</label>
                <input
                    id="name"
                    className="appearance-none bg-transparent border-b-2 border-lff_700 py-2 leading-tight focus:outline-none mb-10 placeholder-lff_700 text-lff_800"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <label htmlFor="email" className="font-sorts font-bold mb-2 text-lff_800">Email</label>
                <input
                    id="email"
                    className="appearance-none bg-transparent border-b-2 border-lff_700 py-2 leading-tight focus:outline-none mb-10 placeholder-lff_700 text-lff_800"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="message" className="font-sorts font-bold mb-2 text-lff_800">Message</label>
                <textarea
                    id="message"
                    className="appearance-none bg-transparent border-2 px-3 py-3 border-lff_700 leading-tight focus:outline-none mb-10 resize-none placeholder-lff_700 text-lff_800"
                    placeholder="Enter your message"
                    rows="5"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                >
                </textarea>
                <div className="flex items-center">
                    <button className="flex text-base  py-3 space-x-3 border-2 border-lff_800 w-full md:w-48 justify-center bg-lff_200 hover:bg-lff_500 transition-all ">
                        <span className="font-bold text-lff_800">Send Message</span>
                        <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V2L10 4" stroke="#665F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 2L14 4" stroke="#665F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1.97998 13H6.38998C6.76998 13 7.10998 13.21 7.27998 13.55L8.44998 15.89C8.78998 16.57 9.47998 17 10.24 17H13.77C14.53 17 15.22 16.57 15.56 15.89L16.73 13.55C16.9 13.21 17.25 13 17.62 13H21.98" stroke="#665F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 5.13C3.46 5.65 2 7.73 2 12V15C2 20 4 22 9 22H15C20 22 22 20 22 15V12C22 7.73 20.54 5.65 17 5.13" stroke="#665F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>
                    {loading ? (<span className="pl-4 text-lff_800 flex items-center">
                        <span>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-lff_800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        <span>Sending</span>
                    </span>) : ''}
                </div>
            </form>
            <div className="absolute hidden md:block bottom-10">
                <h3 className="font-sorts text-lg font-bold">Send us an email</h3>
                <p className="font-verl"><a href="mailto:info@theluigifootprints.org">info@theluigifootprints.org</a></p>
            </div>
        </div >
    )
}

// export async function getStaticProps({ preview = false }) {
//     const data = await createMessage()
//     return {
//         props: { allProjects, preview },
//     }
// }

export default Index