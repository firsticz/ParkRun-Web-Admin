import gql from 'graphql-tag'

export default gql`
query getUser($bib: Float!) {
    userOne(filter:{bib: $bib}){
      _id
      name
      phone
      bib
      image
      email
    }
  }
`