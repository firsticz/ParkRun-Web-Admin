import gql from 'graphql-tag'

export default gql`
query($eventId : MongoID){
    regisMany(filter:{
        eventId: $eventId
    }){
        _id
        userId
        eventId
        regisType
        status
        user {
            name
            gender
        }
    }
  }
`