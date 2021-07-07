import gql from 'graphql-tag'

export default gql`
query($time: Int, $date: Date){
    getRunnerReport(time:$time, date: $date){
      _id
      bib
      name
      gender
      phone
      email
      timeCount
    }
  }
`