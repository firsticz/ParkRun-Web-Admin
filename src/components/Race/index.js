import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import RaceList from './race'

class Races extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/races"
          component={RaceList}
        />
      </Switch>
    )
  }
}

export default Races