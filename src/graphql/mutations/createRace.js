import gql from 'graphql-tag'

export default gql`
mutation raceCreateOne($record: CreateOneracesInput!) {
    raceCreateOne(record: $record) {
    record{
      _id
    }
    
  }
}
`