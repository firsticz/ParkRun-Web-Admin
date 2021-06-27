import gql from 'graphql-tag'

export default gql`
mutation($time: Int){
    exportVolunteer(time: $time){
      url
      fileName
    }
  }
`