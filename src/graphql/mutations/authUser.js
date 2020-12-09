import gql from 'graphql-tag'

export default gql`
mutation adminAuth($email: String!, $password: String!) {
  adminAuth(email: $email, password: $password){
    token
  }
}`