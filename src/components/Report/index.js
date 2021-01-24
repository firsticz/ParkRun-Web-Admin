import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import reportList from './reportList'

class Races extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/report"
          component={reportList}
        />
      </Switch>
    )
  }
}

export default Races