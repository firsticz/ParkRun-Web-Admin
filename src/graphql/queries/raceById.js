import gql from 'graphql-tag'

export default gql`
query($_id : MongoID){
    raceOne(filter:{
      _id: $_id
    }){
        _id
        name
        slug
        organizId
        eventId
        startTime
    }
  }
`