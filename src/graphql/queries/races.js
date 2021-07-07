import gql from 'graphql-tag'

export default gql`
query($_id : MongoID){
    raceMany(filter:{
        eventId: $_id
    }, limit: 20000){
        _id
        name
          slug
        organizId
        eventId
        startTime
        status
    }
  }
`