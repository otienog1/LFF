import { useEffect, useRef } from 'react'
import Link from 'next/link'
import LFFLogo from './LFFLogo'
import { isMobile } from './Layout'

const Logo = () => {
    const logo = useRef(null)

    useEffect(() => {
        if (isMobile) {
            logo.current.style.left = `${(document.documentElement.clientWidth - (document.documentElement.clientWidth * .91666667)) / 2}px`
        }
    })

    return (
        <span ref={logo} className='absolute top-5 z-50 hidden lg:block'>
            <Link href={'/'}>
                <a>
                    <LFFLogo width="225" height="130" fill="#665F4B" />
                </a>
            </Link>
        </span>
    )
}

export default Logo