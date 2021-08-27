import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { removeLastTrailingSlash } from '../lib/util'
import '../styles/globals.css'

let token

if (typeof window !== 'undefined')
    token = localStorage.getItem('auth_token')

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://lff-api.test/graphql',
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        }
    }),
    cache: new InMemoryCache()
})

function MyApp({ Component, pageProps }) {
    return <ApolloProvider client={client}><Component {...pageProps} /></ApolloProvider>
}

export default MyApp
