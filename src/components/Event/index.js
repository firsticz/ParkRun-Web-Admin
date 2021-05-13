import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import EventList from './event'
import EventCreate from './eventCreate'
import EventEdit from './eventEdit'
import EventBoard from './eventBoard'
import RacesList from './racesList'
import Registrations from './RegistrationByRace'
import RaceRegistrations from './racesRegistration'
import EventStats from './eventStats'
import RaceCreate from './raceCreate'
import AddCheckpoint from './addCheckpoint'
class Events extends Component {
  render () {
    return (
      <Switch>
        <Route 
          exact
          path="/events"
          component={EventList}
        />
        <Route
          exact
          path="/events/create"
          component={EventCreate}
          />
        <Route
          exact
          path="/events/:eventId/edit"
          component={EventEdit}
          />
          {/* <Route
          exact
          path="/events/:eventId/stats"
          component={EventBoard}
          /> */}
          <Route
          exact
          path="/events/:eventId/races"
          component={RacesList}
          />
          <Route
          exact
          path="/events/:eventId/result"
          component={EventBoard}
          />
          <Route
          exact
          path="/events/:eventId/checkpoint"
          component={AddCheckpoint}
          />
          <Route
          exact
          path="/events/:eventId/registrations"
          component={RaceRegistrations}
          />
          <Route
          exact
          path="/events/:eventId/racesregistrations/:raceId"
          component={Registrations}
          />
          <Route
          exact
          path="/events/:eventId/stats"
          component={EventStats}
          />
          <Route
          exact
          path="/events/:eventId/createrace"
          component={RaceCreate}
          />
      </Switch>
    )
  }
}

export default Events