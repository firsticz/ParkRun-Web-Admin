import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AddCheckpoint from './create'

class Checkpoints extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/Checkpoints"
          component={AddCheckpoint}
        />
      </Switch>
    )
  }
}

export default Checkpoints