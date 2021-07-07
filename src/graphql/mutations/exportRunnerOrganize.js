import gql from 'graphql-tag'

export default gql`
mutation($eventId: MongoID!){
    exportAllRuunerByOrganize(eventId: $eventId){
      url
      fileName
    }
  }
`