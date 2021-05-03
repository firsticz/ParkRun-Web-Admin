import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AddUser from './create'
import FindUser from './find'
import EditUser from './userEdit'

class Users extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/users"
          component={AddUser}
        />
        <Route 
          exact
          path="/users/find"
          component={FindUser}
        />
        <Route
          exact
          path="/users/:userId/edit"
          component={EditUser}
          />
      </Switch>
    )
  }
}

export default Users