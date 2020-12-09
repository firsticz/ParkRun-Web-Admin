import gql from 'graphql-tag'

export default gql`
query($_id : MongoID){
    eventOne(filter:{
      _id: $_id
    }){
        _id
        name
          slug
        image
        organizId
        organizName
        organizPhone
        deleted
        approved
        address
        province
        description
    }
  }
`