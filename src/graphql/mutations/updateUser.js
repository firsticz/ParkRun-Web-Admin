import gql from 'graphql-tag'

export default gql`
mutation updateUser($record: UpdateByIdusersInput!) {
  userUpdateById(record: $record) {
    record{
      _id
    }
    
  }
}
`