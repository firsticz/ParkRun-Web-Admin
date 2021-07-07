import gql from 'graphql-tag'

export default gql`
mutation($_id: MongoID!){
    deleteCheckPoint(_id: $_id)
  }
`