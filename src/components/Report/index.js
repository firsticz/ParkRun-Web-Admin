import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import reportList from './reportList'
import allrunner from './allRunner'

class Races extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/report"
          component={reportList}
        />
        <Route 
          exact
          path="/report/runner"
          component={allrunner}
        />
      </Switch>
    )
  }
}

export default Races