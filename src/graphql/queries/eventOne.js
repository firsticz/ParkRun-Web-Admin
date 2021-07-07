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
        organizEmail
        deleted
        approved
        address
        province
        description
        road
        route
        location
        startPoint
        finishPoint
        banner
        eventRoute
        levels
        region
    }
  }
`