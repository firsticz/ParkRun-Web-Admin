import gql from 'graphql-tag'

export default gql`
query{
    raceMany{
        _id
        name
          slug
        organizId
        eventId
        startTime
        status
    }
  }
`