import Alert from './Alert'
import Footer from './Footer'
import Header from './Header'
import Meta from './Meta'

const Layout = ({ preview, children }) => (
    <div className="font-itc antialiased bg-lffbg">
        <Meta />
        {/* <Alert preview={preview} /> */}
        <Header />
        <div className="min-h-screen">
            <main>{children}</main>
        </div>
        <Footer />
    </div>
)

export default Layout