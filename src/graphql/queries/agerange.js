import gql from 'graphql-tag'

export default gql`
    query{
        ageRangeStat{
            date
            Unknown
            UnknownColor
            Under19
            Under19Color
            age20_29
            age20_29Color
            age30_39
            age30_39Color
            age40_49
            age40_49Color
            age50_59
            age50_59Color
            age60_69
            age60_69Color
            age70_79
            age70_79Color
            Over80
            Over80Color
        }
    }
`
