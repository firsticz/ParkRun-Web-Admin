import gql from 'graphql-tag'

export default gql`
query{
    genderWeekStats{
      date
      male
      female
    }
}
`