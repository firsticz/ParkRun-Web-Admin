import gql from 'graphql-tag'

export default gql`
query{
  eventMany{
    _id
    name
  	slug
    image
    organizId
    organizName
    deleted
    approved
  }
}
`