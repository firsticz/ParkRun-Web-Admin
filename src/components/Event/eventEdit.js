import React from 'react'
import {
  Route
} from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { Layout } from 'antd'
import EventForm from './eventForm'
import _get from 'lodash/get'
import EventSider from './eventSider'
import eventQuery from '../../graphql/queries/eventOne'



const EventEdit = (props) => {
  const { match } = props
  const { eventId } = match.params

  const eventProps = useQuery(eventQuery, {
    variables: {
      _id: eventId
    }
  })
  const eventLoading = _get(eventProps, 'loading')
  const event = _get(eventProps, 'data.eventOne')

  if (eventLoading) {
    return <div>...loading</div>
  } 
  if(!event){
    return 'event not found'
  }

  return (
    // <div>
    //   <div style={{ maxWidth: '1000px', margin: 'auto', marginBottom: '100px' }}>
    //     <div style={{ background: 'white', borderRadius: '0 0 8px 8px' }}>
        <Layout>
          {event && <EventSider />}
          <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            <Route
              exact
              path="/events/:eventId/edit"
              render={props => <EventForm {...props}  event={event}/>}
            />
          </Layout.Content>

        </Layout>
    //     </div>
    //   </div>
    // </div>
  )

}

export default EventEdit