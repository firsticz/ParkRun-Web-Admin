import React, { Component, useEffect } from 'react'
import compose from 'lodash/flowRight'
import { useQuery } from '@apollo/react-hooks'


import { Table, Icon, Tooltip, Input, Layout, Row, Col, Card } from 'antd'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import getallStat from '../../graphql/queries/allStat'
import getgenderweekStat from '../../graphql/queries/genderWeek'
import '../../style/Stats.css'
import StatRenderChart from '../chart/allStatLinechart'
import GenderWeekChart from '../chart/genderWeekBarChart'

const Stats = () => {
  const statall = useQuery(getallStat, {fetchPolicy: 'network-only'})
  const statgenderweek = useQuery(getgenderweekStat, {fetchPolicy: 'network-only'})



  if(statall.loading){
    return <p>loading .....</p>
  }
  if(statgenderweek.loading){
    return <p>loading .....</p>
  }

  const statresult = statall.data.resultStats
  const statGenderWeek = statgenderweek.data.genderWeekStats


  return (
    <Layout>
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        <Row gutter={16} style={{width: '100%'}}>

          <Col sm={24} md={24} lg={12} style={{width: '100%'}}>
            <Card
              hoverable
              cover={<div className="chart-pie-cover">
                <StatRenderChart data={statresult}  />
              </div>}
            />
          </Col>
          <Col sm={24} md={24} lg={12} style={{width: '100%'}}>
            <Card
              hoverable
              cover={<div className="chart-pie-cover">
                <GenderWeekChart data={statGenderWeek}  />
              </div>}
            />
          </Col>
        </Row>
        
      </Layout.Content>
    </Layout>
  )
}

export default Stats