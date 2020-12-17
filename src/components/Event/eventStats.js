import React, { Component, useEffect } from 'react'
import {
  Link,
  Route
} from 'react-router-dom'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import ReactFC from 'react-fusioncharts'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'

import { Table, Icon, Tooltip, Input, Layout, Row, Col, Card } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import EventForm from './eventForm'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import EventSider from './eventSider'
import getRegistrationGender from '../../graphql/queries/getRegisGender'
import getRegistration from '../../graphql/queries/getRegistrations'
import getallStat from '../../graphql/queries/allStat'
import '../../style/Stats.css'
import StatRenderChart from '../chart/allStatLinechart'

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme)

const EventStats = () => {
  const { eventId } = useParams()
  const regis = useQuery(getRegistrationGender, {
    variables: {eventId: eventId}
  })
  const regisall = useQuery(getRegistration, {
    variables: {eventId: eventId}
  })
  const statall = useQuery(getallStat, {fetchPolicy: 'network-only'})


  if(regis.loading){
    return <p>loading .....</p>
  }
  if(regisall.loading){
    return <p>loading .....</p>
  }
  if(statall.loading){
    return <p>loading .....</p>
  }

  const participantGender = regis.data.participantGender
  const registrations = regisall.data.regisMany
  const statresult = statall.data.resultStats
  console.log(statresult);
  const runnerRegistrations = _filter(registrations, {'regisType': 'RUNNER'})
  const valunteerRegistrations = _filter(registrations, {'regisType': 'VALUNTEER'})

  const runnerCount = runnerRegistrations.length
  const valunteerCount = valunteerRegistrations.length

  const registrationTypeCount = [
    {
      'regisType': 'runner',
      'count': runnerCount
    },
    {
      'regisType': 'volunteer',
      'count': valunteerCount
    }
  ]


  const registrationsByGender= participantGender && {
    chart: {
      caption: "สัดส่วนเพศชาย-หญิง(Gender)",
      
      subCaption: "All Month ",
      startingangle: "20",
      showpercentvalues: "1",
      showpercentintooltip: "0",
      showlegend: "1",
      decimals: "1",
      enablemultislicing: "0",
      numberSuffix: " person",
      theme: "fusion"
    },
    data: participantGender && participantGender.map(({gender, count}) => ({ label: gender, value: count }))
  }

  const registrationsByregisType= registrationTypeCount && {
    chart: {
      caption: "สัดส่วนประเภทการสมัครการสมัคร",
      
      subCaption: "All ",
      startingangle: "20",
      showpercentvalues: "1",
      showpercentintooltip: "0",
      showlegend: "1",
      decimals: "1",
      enablemultislicing: "0",
      numberSuffix: " person",
      theme: "fusion"
    },
    data: registrationTypeCount && registrationTypeCount.map(({regisType, count}) => ({ label: regisType, value: count }))
  }
  console.log(registrationsByregisType)

  return (
    <Layout>
      <EventSider />
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        <Row gutter={16} style={{width: '100%'}}>
          <Col sm={24} md={24} lg={12} style={{width: '100%'}}>
            <Card
              hoverable
              cover={<div className="chart-pie-cover">
                <ReactFC
                  type="column2d"
                  width="80%"
                  height="80%"
                  dataFormat="JSON"
                  dataSource={registrationsByGender}
                />
              </div>}
            />
          </Col>
          <Col sm={24} md={24} lg={12} style={{width: '100%'}}>
            <Card
              hoverable
              cover={<div className="chart-pie-cover">
                <ReactFC
                  type="pie2d"
                  width="80%"
                  height="80%"
                  dataFormat="JSON"
                  dataSource={registrationsByregisType}
                />
              </div>}
            />
          </Col>

          <Col sm={24} md={24} lg={12} style={{width: '100%'}}>
            <Card
              hoverable
              cover={<div className="chart-pie-cover">
                <StatRenderChart data={statresult}  />
              </div>}
            />
          </Col>
        </Row>
        
      </Layout.Content>
    </Layout>
  )
}

export default EventStats