import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import OrganzeList from './OrganizerList'
class Organizers extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/organizers"
          component={OrganzeList}
        />
      </Switch>
    )
  }
}

export default Organizers