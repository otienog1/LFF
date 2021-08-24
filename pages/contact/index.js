import Head from 'next/head'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { useState } from 'react'

import { createMessage } from '../../lib/api'

const Index = () => {

    return (
        <>
            <Layout preview>
                <Head>
                    <title>Contact | Luigi Footprints Foundation</title>
                </Head>
                <div className="flex md:justify-end">
                    <Container>
                        <div className="flex">
                            <div className="md:w-1/2">
                                <h2 className="text-base">Get In Touch</h2>
                                <h3 className="font-sorts text-4xl mt-3">We'd love to hear from you</h3>
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

        handleNameChange = e => {
            setName(e.target.value)
        },
        handleEmailChange = e => {
            setEmail(e.target.value)
        },
        handleMessageChange = e => {
            setMessage(e.target.value)
        },

        saveData = async () => {
            const payload = {
                title: `New Contact From ${name}.`,
                email: email,
                message: message
            }
            const data = await createMessage(payload)

            console.log(payload)

            return data
        },

        handleSubmit = e => {
            e.preventDefault()
            saveData()
        }

    return (
        <div className="md:w-1/2">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <label htmlFor="name" className="font-sorts font-bold mb-4">Name</label>
                <input id="name" className="appearance-none bg-transparent border-b py-2.5 leading-tight focus:outline-none mb-6" type="text" placeholder="Enter your name" value={name} onChange={handleNameChange} />
                <label htmlFor="email" className="font-sorts font-bold mb-4">Email</label>
                <input id="email" className="appearance-none bg-transparent border-b py-2.5 leading-tight focus:outline-none mb-6" type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
                <label htmlFor="message" className="font-sorts font-bold mb-4">Message</label>
                <textarea id="message" className="appearance-none bg-transparent border-b py-2.5 leading-tight focus:outline-none mb-6 resize-none" placeholder="Enter your message" rows="3" value={message} onChange={handleMessageChange}></textarea>
                <button className="flex font-verl text-base bg-lfflighter rounded py-3 space-x-3 shadow-sm w-48 justify-center">
                    <span className="font-bold text-primary">Send Message</span>
                    <span>
                        <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                                <path
                                    d="M0.0864258 12L20.7267 12"
                                    stroke="#3F3F3F"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.1226 5L20.7269 12L16.9247 15.5L13.1226 19"
                                    stroke="#3F3F3F"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <path
                                        d="M0.0864258 4C0.0864258 1.79086 1.87729 0 4.08643 0H22.1584C24.3675 0 26.1584 1.79086 26.1584 4V20C26.1584 22.2091 24.3675 24 22.1584 24H4.08642C1.87728 24 0.0864258 22.2091 0.0864258 20V4Z"
                                        fill="white"
                                    />
                                </clipPath>
                            </defs>
                        </svg>

                    </span>
                </button>
            </form>
        </div>
    )
}

// export async function getStaticProps({ preview = false }) {
//     const data = await createMessage()
//     return {
//         props: { allProjects, preview },
//     }
// }

export default Index