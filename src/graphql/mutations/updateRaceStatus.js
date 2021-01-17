import gql from 'graphql-tag'

export default gql`
mutation raceUpdateById($record: UpdateByIdracesInput!) {
    raceUpdateById(record: $record) {
    record{
      _id
    }
    
  }
}
`