import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { removeLastTrailingSlash } from './util';

let client;

/**
 * getApolloClient
 */

export function getApolloClient() {
    if (!client) {
        client = _createApolloClient();
    }
    return client;
}

/**
 * createApolloClient
 */

export function _createApolloClient() {
    return new ApolloClient({
        link: new HttpLink({
            uri: removeLastTrailingSlash(process.env.LFF_API_URL),
        }),
        cache: new InMemoryCache(),
    });
}