import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AddUser from './create'

class Users extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/users"
          component={AddUser}
        />
      </Switch>
    )
  }
}

export default Users