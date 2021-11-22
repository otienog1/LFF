import { useRef } from 'react'
import { ApolloClient, createHttpLink, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { SwitchTransition, Transition } from 'react-transition-group'
import gsap from 'gsap'

import '../styles/globals.css'


const httpLink = createHttpLink({
    uri: 'http://lff-api.test/graphql'
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
    const overlayPath = useRef()
    const overlay = useRef()

    let isAnimating = false

    const resetOverlay = () => {
        gsap.set(overlay.current, {
            yPercent: 'unset',
            height: '0%'
        })
        gsap.set(overlayPath.current, {
            yPercent: 'unset',
            height: '0%'
        })
    }

    function enter(node) {
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
            .set(overlayPath.current, {
                height: '100%'
            })



            .to(overlay.current, {
                yPercent: -100,
                ease: 'power3.inOut'
            }, 1)
            .to(overlayPath.current, {
                yPercent: -100,
                ease: 'power3.inOut'
            }, 1.2)

    }

    function exit() {
        gsap.timeline({
            // onComplete: () => resetOverlay()
            defaults: {
                duration: 1
            }
        })
            .to(overlayPath.current, {
                height: '100%',
                ease: 'power3.inOut',
            })
            .to(overlay.current, {
                height: '100%',
                ease: 'power3.inOut',
            }, .2)
    }

    return (
        <ApolloProvider client={client}>
            <SwitchTransition>
                <Transition
                    key={router.pathname}
                    timeout={1200}
                    in={true}
                    onEnter={enter}
                    onExit={exit}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <>
                        <Component {...pageProps} />
                        <div ref={overlayPath} className="z-40 bg-lff_500 fixed w-full bottom-0 h-0"></div>
                        <div ref={overlay} className="z-50 bg-lff_400 fixed w-full bottom-0 h-0"></div>
                        {/* <svg class="overlay" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path ref={overlayPath} class="overlay__path" vectorEffect="non-scaling-stroke" d="M 0 100 V 100 Q 50 100 100 100 V 100 z" />
                        </svg> */}
                    </>
                </Transition>
            </SwitchTransition>
        </ApolloProvider>
    )
}

export default MyApp