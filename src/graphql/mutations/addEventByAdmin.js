import gql from 'graphql-tag'

export default gql`
mutation createEvent($record: CreateOneeventsInput!) {
    eventCreateOne(record: $record) {
      record {
        name
      }
    }
  }
`