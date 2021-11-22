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
    mutation EmailMutation($from: String!, $subject: String!, $body: String!) {
        sendEmail(
            input: {
                clientMutationId: "sendEmail", 
                to: "otienog1@gmail.com", 
                from: $from, 
                subject: $subject, 
                body: $body
            }
        ) {
            message
            sent
            to
        }
    }`