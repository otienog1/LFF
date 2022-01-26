import Head from 'next/head'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE, SEND_EMAIL } from '../../data/contact'
import Alert from '../../components/Alert'
import Link from 'next/link'
import Logo from '../../components/Logo'

const Index = () => {
    return (
        <>
            <Layout preview>
                <Head>
                    <title>Contact | Luigi Footprints Foundation</title>
                </Head>
                <div className="flex md:justify-center p-6 md:p-0">
                    <Container>
                        <Logo />
                        <div className="flex flex-col md:flex-row md:h-screen">
                            <div className="flex w-full md:w-1/2 md:h-full relative items-center">
                                <div>
                                    {/* <h2 className="text-base font-verl text-lff_800 mb-10 font-bold">Get In Touch</h2> */}
                                    <h3 className="font-sorts text-4xl md:text-7xl xl:text-8xl 2xl:text-9xl text-lff_800 leading-none">We'd love to hear from you</h3>
                                </div>
                                <div className="hidden md:flex w-3/4 justify-between absolute bottom-10">
                                    <div>
                                        <Link href="https://www.instagram.com/maniagosafaris/">
                                            <span className="flex space-x-3 cursor-pointer">
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.6481 4.91018C15.4339 4.91018 15.2245 4.97347 15.0465 5.09205C14.8684 5.21063 14.7296 5.37918 14.6476 5.57637C14.5656 5.77356 14.5442 5.99055 14.586 6.19988C14.6278 6.40922 14.7309 6.60151 14.8824 6.75243C15.0338 6.90336 15.2268 7.00614 15.4368 7.04778C15.6469 7.08942 15.8646 7.06805 16.0625 6.98637C16.2604 6.90469 16.4295 6.76637 16.5485 6.5889C16.6675 6.41143 16.731 6.20279 16.731 5.98935C16.731 5.70314 16.6169 5.42865 16.4138 5.22626C16.2108 5.02388 15.9353 4.91018 15.6481 4.91018ZM19.7993 7.0865C19.7818 6.34035 19.6415 5.60211 19.3842 4.90119C19.1547 4.30147 18.7976 3.75842 18.3374 3.30942C17.8905 2.84846 17.3443 2.49481 16.7401 2.27522C16.0385 2.01096 15.2969 1.86802 14.5471 1.85254C13.5905 1.79858 13.2837 1.79858 10.8291 1.79858C8.37444 1.79858 8.06761 1.79858 7.11103 1.85254C6.36124 1.86802 5.61961 2.01096 4.9181 2.27522C4.31498 2.49703 3.76924 2.85038 3.32079 3.30942C2.85822 3.75473 2.50333 4.29905 2.28298 4.90119C2.01781 5.60026 1.87436 6.33932 1.85883 7.0865C1.80469 8.03977 1.80469 8.34553 1.80469 10.7916C1.80469 13.2378 1.80469 13.5435 1.85883 14.4968C1.87436 15.244 2.01781 15.983 2.28298 16.6821C2.50333 17.2842 2.85822 17.8285 3.32079 18.2739C3.76924 18.7329 4.31498 19.0863 4.9181 19.3081C5.61961 19.5723 6.36124 19.7153 7.11103 19.7307C8.06761 19.7847 8.37444 19.7847 10.8291 19.7847C13.2837 19.7847 13.5905 19.7847 14.5471 19.7307C15.2969 19.7153 16.0385 19.5723 16.7401 19.3081C17.3443 19.0885 17.8905 18.7348 18.3374 18.2739C18.7996 17.8265 19.1571 17.283 19.3842 16.6821C19.6415 15.9812 19.7818 15.2429 19.7993 14.4968C19.7993 13.5435 19.8535 13.2378 19.8535 10.7916C19.8535 8.34553 19.8535 8.03977 19.7993 7.0865ZM18.1749 14.3889C18.1684 14.9597 18.0646 15.5253 17.8681 16.0616C17.724 16.4529 17.4926 16.8066 17.1913 17.0958C16.8986 17.393 16.5444 17.6232 16.1535 17.7703C15.6153 17.9661 15.0478 18.0695 14.4749 18.076C13.5725 18.121 13.2386 18.13 10.8652 18.13C8.49176 18.13 8.15786 18.13 7.25542 18.076C6.66061 18.0871 6.06835 17.9958 5.50469 17.8062C5.13088 17.6516 4.79298 17.422 4.512 17.1317C4.21247 16.8428 3.98394 16.4889 3.8442 16.0975C3.62387 15.5536 3.50167 14.9752 3.48322 14.3889C3.48322 13.4896 3.42908 13.1568 3.42908 10.7916C3.42908 8.42647 3.42908 8.09372 3.48322 7.19442C3.48727 6.61082 3.59418 6.03247 3.79908 5.48574C3.95795 5.10615 4.2018 4.76778 4.512 4.4965C4.78618 4.18729 5.12502 3.94172 5.50469 3.77706C6.05477 3.57925 6.63454 3.47586 7.21932 3.47129C8.12176 3.47129 8.45566 3.41733 10.8291 3.41733C13.2025 3.41733 13.5364 3.41733 14.4388 3.47129C15.0117 3.47784 15.5792 3.58123 16.1174 3.77706C16.5275 3.92873 16.8955 4.17531 17.1913 4.4965C17.487 4.77275 17.7181 5.11049 17.8681 5.48574C18.0687 6.03335 18.1725 6.61147 18.1749 7.19442C18.2201 8.09372 18.2291 8.42647 18.2291 10.7916C18.2291 13.1568 18.2201 13.4896 18.1749 14.3889ZM10.8291 6.1782C9.91383 6.17998 9.01965 6.45206 8.25952 6.96007C7.49939 7.46809 6.90742 8.18923 6.55841 9.03238C6.20939 9.87553 6.119 10.8029 6.29865 11.6972C6.4783 12.5915 6.91992 13.4127 7.56773 14.057C8.21554 14.7013 9.04045 15.1398 9.93824 15.3171C10.836 15.4944 11.7664 15.4025 12.6118 15.053C13.4572 14.7036 14.1797 14.1123 14.688 13.3538C15.1963 12.5953 15.4676 11.7037 15.4676 10.7916C15.4688 10.1847 15.3496 9.58352 15.1168 9.02267C14.884 8.46181 14.5422 7.95236 14.1111 7.52361C13.68 7.09486 13.1682 6.75527 12.6049 6.52437C12.0416 6.29348 11.4381 6.17583 10.8291 6.1782ZM10.8291 13.7863C10.2347 13.7863 9.65371 13.6107 9.15952 13.2816C8.66533 12.9526 8.28016 12.4849 8.05271 11.9377C7.82526 11.3905 7.76574 10.7883 7.8817 10.2074C7.99765 9.62649 8.28386 9.09289 8.70414 8.67408C9.12441 8.25526 9.65987 7.97005 10.2428 7.85449C10.8257 7.73894 11.43 7.79825 11.9791 8.02491C12.5282 8.25157 12.9975 8.63541 13.3277 9.12788C13.658 9.62035 13.8342 10.1993 13.8342 10.7916C13.8342 11.1849 13.7565 11.5743 13.6054 11.9377C13.4544 12.301 13.2331 12.6311 12.954 12.9092C12.675 13.1873 12.3437 13.4079 11.9791 13.5584C11.6145 13.7089 11.2237 13.7863 10.8291 13.7863Z" fill="#665F4B" />
                                                </svg>
                                                <span className="font-verl"><a>Instagram</a></span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="">
                                        <Link href="https://www.facebook.com/ManiagoSafarisEastAfrica">
                                            <span className="flex space-x-3 cursor-pointer">
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.6798 4.78431H15.3763V1.92451C14.5549 1.83939 13.7295 1.79737 12.9037 1.79861C10.449 1.79861 8.77049 3.29146 8.77049 6.02535V8.38153H6V11.5831H8.77049V19.7847H12.0915V11.5831H14.8529L15.268 8.38153H12.0915V6.3401C12.0915 5.39583 12.3441 4.78431 13.6798 4.78431Z" fill="#665F4B" />
                                                </svg>
                                                <span className="font-verl"><a>Facebook</a></span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg">
                                            <span className="flex space-x-3 cursor-pointer">
                                                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 17H6C3 17 1 15 1 12V6C1 3 3 1 6 1H16C19 1 21 3 21 6V12C21 15 19 17 16 17Z" stroke="#665F4B" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10.4001 6.50006L12.9001 8.0001C13.8001 8.6001 13.8001 9.5001 12.9001 10.1001L10.4001 11.6001C9.4001 12.2001 8.6001 11.7001 8.6001 10.6001V7.6001C8.6001 6.30006 9.4001 5.90006 10.4001 6.50006Z" stroke="#665F4B" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span className="font-verl"><a>Youtube</a></span>
                                            </span>
                                        </Link>
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
                    }).then(() => {
                        setAlerts({
                            type: 'success',
                            message: ['Your message has been sent successfully'],
                            title: 'Message sent!'
                        })

                        sendEmail({
                            variables: {
                                to: "info@theluigifootprints.org",
                                from: email,
                                subject: `LFF Website Contact Page Message From - ${name}`,
                                body: `<table>
                                <tbody>
                                <tr>
                                <td> Message: ${message}<td>
                                </tr>
                                <tr>
                                <td>
                                <br/>
                                <br/>
                                Message from: <br/><br/> Name: ${name} <br>Email: ${email}
                                </td>
                                </tr>
                                </tbody>
                                </table>`
                            }
                        }).then(() => {
                            setName('')
                            setEmail('')
                            setMessage('')
                        })
                        setErrors(true)
                    })

                }}>
                {errors ? <Alert alert={alerts} /> : ''}
                <label htmlFor="name" className="font-sorts font-bold mb-2 text-lff_800">Name</label>
                <input
                    id="name"
                    className="appearance-none bg-transparent border-b border-lff_700 py-2 leading-tight focus:outline-none mb-10 placeholder-lff_700 text-lff_800"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <label htmlFor="email" className="font-sorts font-bold mb-2 text-lff_800">Email</label>
                <input
                    id="email"
                    className="appearance-none bg-transparent border-b border-lff_700 py-2 leading-tight focus:outline-none mb-10 placeholder-lff_700 text-lff_800"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="message" className="font-sorts font-bold mb-2 text-lff_800">Message</label>
                <textarea
                    id="message"
                    className="appearance-none bg-transparent border px-3 py-3 border-lff_700 leading-tight focus:outline-none mb-10 resize-none placeholder-lff_700 text-lff_800"
                    placeholder="Enter your message"
                    rows="5"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                >
                </textarea>
                <div className="flex items-center">
                    <button className="donate-button text-lff_800 flex font-sen items-center text-sm  py-5 px-8 space-x-2 border-solid border border-lff_800 w-auto justify-center bg-lff_200 hover:bg-lff_400">
                        <span className="text-lff_800 lowercase">Send Message</span>
                        <span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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