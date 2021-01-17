import gql from 'graphql-tag'

export default gql`
query{
    adminList{
        name
        gender
        phone
        image
        bib
        email
        emergenPhone
    }
  }
`