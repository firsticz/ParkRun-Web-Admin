import gql from 'graphql-tag'

export default gql`
query{
    eventNotRun{
          _id
      name
      slug
      organizId
      
    }
  }
`