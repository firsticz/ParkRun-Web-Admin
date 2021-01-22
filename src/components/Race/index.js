import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import RaceList from './race'
import CrateRace from './create'

class Races extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/races"
          component={RaceList}
        />
        <Route 
          exact
          path="/races/create"
          component={CrateRace}
        />
      </Switch>
    )
  }
}

export default Races