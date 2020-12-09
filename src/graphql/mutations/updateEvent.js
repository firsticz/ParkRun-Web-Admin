import gql from 'graphql-tag'

export default gql`
mutation updateEvent($record: UpdateByIdeventsInput!) {
  eventUpdateById(record: $record) {
    record{
      _id
      name
      slug
      image
      organizId
      organizName
      deleted
      approved
    }
    
  }
}
`