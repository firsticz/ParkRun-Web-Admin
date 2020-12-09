import gql from 'graphql-tag'

export default gql`
mutation addUsers($users: [usersInput]) {
  addUsers(users: $users) {
    userId
    email
    _id
  }
}`