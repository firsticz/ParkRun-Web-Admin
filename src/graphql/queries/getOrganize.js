import gql from 'graphql-tag'

export default gql`
query{
    organizerList{
        name
        gender
        phone
        image
        bib
        email
        emergenPhone
        event{
            name
          }
    }
  }
`