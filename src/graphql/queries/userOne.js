import gql from 'graphql-tag'

export default gql`
  query($_id : MongoID){
    userOne(filter:{
        _id: $_id
      }){
      _id
      bib
      phone
      idcard
      name
      role
      email
      gender
      birthDate
      emergenPhone
      drug
      image
    }
  }
`
