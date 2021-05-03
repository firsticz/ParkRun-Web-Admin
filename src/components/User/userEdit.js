import React from 'react'
import {
  Route
} from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { Layout } from 'antd'
import UserForm from './userForm'
import _get from 'lodash/get'
import userQuery from '../../graphql/queries/userOne'



const UserEdit = (props) => {
  const { match } = props
  const { userId } = match.params

  const userProps = useQuery(userQuery, {
    variables: {
      _id: userId
    },
    fetchPolicy: 'network-only'
  })
  const userLoading = _get(userProps, 'loading')
  const user = _get(userProps, 'data.userOne')
  console.log(user);

  if (userLoading) {
    return <div>...loading</div>
  } 
  if(!user){
    return 'user not found'
  }

  return (
    // <div>
    //   <div style={{ maxWidth: '1000px', margin: 'auto', marginBottom: '100px' }}>
    //     <div style={{ background: 'white', borderRadius: '0 0 8px 8px' }}>
        <Layout>
          {user && userLoading}
          <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            <Route
              exact
              path="/users/${userId}/edit"
              render={props => <UserForm {...props}  user={user}/>}
            />
          </Layout.Content>

        </Layout>
    //     </div>
    //   </div>
    // </div>
  )

}

export default UserEdit