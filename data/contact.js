import { gql } from '@apollo/client'

export const CREATE_MESSAGE = gql`
    mutation MessageMutation($name: String!, $email: String!, $message: String!) {
        createMessage(
            input: {
                clientMutationId: "createMessage"
                name: $name, 
                email: $email,
                message: $message,
                # status: PRIVATE
            }
        ) {
            data,
            success
        }
    }`

export const SEND_EMAIL = gql`
    mutation SEND_EMAIL($to: String!, $from: String!, $subject: String!, $body: String!) {
        sendEmail(
            input: {
                to: $to, 
                from: $from, 
                subject: $subject, 
                body: $body,
                clientMutationId: "sendEmail"
            }
        ) {
            message
            sent
            to
        }
    }`