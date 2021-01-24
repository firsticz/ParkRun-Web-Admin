import gql from 'graphql-tag'

export default gql`
query{
    exportEventAge{
      _id
      name
      totalrunner
      Unknown
      Under19
      age20_29
      age30_39
      age40_49
      age50_59
      age60_69
      age70_79
      Over80
    }
  }
`