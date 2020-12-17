import gql from 'graphql-tag'

export default gql`
query{
    resultStats{
      id
      data{
        x
        y
      }
    }
  }
`