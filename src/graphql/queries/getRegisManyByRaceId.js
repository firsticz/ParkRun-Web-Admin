import gql from 'graphql-tag'

export default gql`
query($eventId : MongoID){
    regisMany(filter:{
        raceId: $eventId
    }){
        _id
        userId
        eventId
        regisType
        status
        user {
            name
            gender
            phone
            image
            bib
            email
            emergenPhone
            drug
        }
    }
  }
`