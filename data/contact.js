import { gql } from '@apollo/client'

export const CREATE_MESSAGE = gql`
    mutation MessageMutation($title: String!, $email: [[String]], $content: String!) {
        createMessage(
            input: {
                clientMutationId: "createMessage"
                title: $title, 
                email: $email,
                content: $content,
                status: PRIVATE
            }
        ) {
            message {
                email
                title
                content
            }
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