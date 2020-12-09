import gql from 'graphql-tag'

export default gql`
query participantGender($eventId: MongoID!) {
    participantGender(eventId: $eventId) {
      gender
      count
    }
  }
`