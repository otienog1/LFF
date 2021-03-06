import { useRef } from 'react'
import { ApolloClient, createHttpLink, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { SwitchTransition, Transition } from 'react-transition-group'
import gsap from 'gsap'

import '../styles/globals.css'


const httpLink = createHttpLink({
    uri: 'https://api.theluigifootprints.org/graphql'
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(token)

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

function MyApp({ Component, pageProps, router }) {
    const overlay = useRef()

    let isAnimating = false

    const resetOverlay = () => {
        gsap.set(overlay.current, {
            yPercent: 'unset',
            height: '0%'
        })
    }

    function enter() {
        window.scrollTo(0, 0)

        if (isAnimating) return

        gsap.timeline({
            defaults: {
                duration: 1
            },
            onComplete: () => resetOverlay()
        })
            .set(overlay.current, {
                height: '100%'
            })


            .to(overlay.current, {
                yPercent: -100,
                ease: 'power3.inOut'
            }, 1)

    }

    function exit() {
        gsap.timeline({
            // onComplete: () => resetOverlay()
            defaults: {
                duration: 1
            }
        })
            .to(overlay.current, {
                height: '100%',
                ease: 'power3.inOut',
            }, 1)
    }

    return (
        <ApolloProvider client={client}>
            <SwitchTransition>
                <Transition
                    key={router.pathname}
                    timeout={2200}
                    in={true}
                    onEnter={enter}
                    onExit={exit}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <>
                        <Component {...pageProps} />
                        <div ref={overlay} className="z-50 bg-lff_600 fixed w-full bottom-0 h-0"></div>
                    </>
                </Transition>
            </SwitchTransition>
        </ApolloProvider>
    )
}

export default MyApp