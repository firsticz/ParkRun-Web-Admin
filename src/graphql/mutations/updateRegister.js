import gql from 'graphql-tag'

export default gql`
mutation updateRegis($record: UpdateByIdregisInput!) {
    updateRegis(record: $record) {
    record{
      _id
    }
    
  }
}
`