import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AdminList from './adminList'
class Admins extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/admins"
          component={AdminList}
        />
      </Switch>
    )
  }
}

export default Admins