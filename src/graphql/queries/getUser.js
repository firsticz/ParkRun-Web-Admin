import gql from 'graphql-tag'

export default gql`
query getUser($email: String!) {
    userOne(filter:{email: $email}){
      email
      userId
      _id
    }
  }
`