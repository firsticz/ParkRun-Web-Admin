import gql from 'graphql-tag'

export default gql`
mutation($time: Int){
    exportRunner(time: $time){
      url
      fileName
    }
  }
`