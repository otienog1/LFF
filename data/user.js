import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
    mutation LoginUser {
        login( input: {
            clientMutationId: "uniqueId",
            username: "contact_page",
            password: "password"
        } 
    ) {
        authToken
        user {
            id
            name
        }
    }
}`