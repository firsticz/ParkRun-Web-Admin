import gql from 'graphql-tag'

export default gql`
query($_id : MongoID){
    raceMany(filter:{
        eventId: $_id
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