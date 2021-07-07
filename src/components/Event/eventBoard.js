import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Layout, Table, Space, Button, Popconfirm, Modal } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
// import { gql, useQuery } from '@apollo/client'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import ReactFC from 'react-fusioncharts'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'

import _groupBy from 'lodash/groupBy'
import moment from 'moment'
import _get from 'lodash/get'
import _unionBy from 'lodash/unionBy'
import _reverse from 'lodash/reverse'
import _sortBy from 'lodash/sortBy'
import _last from 'lodash/last'
import _orderBy from 'lodash/orderBy'
import _includes from 'lodash/includes'
// import last from 'lodash/last'
import clientAuth from '../../utils/clientAuth'
import deleteCheckPointMutation from '../../graphql/mutations/deleteCheckPoint'
import { useMutation } from '@apollo/react-hooks'

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme)

const GET_EVENT_AND_CHECKPOINT = gql`
  query getEventAndCheckpoint($eventId: MongoID!){
    raceById(_id: $eventId) {
      _id
      name
      slug
      organizId
      startTime
      endTime
      haveChipTime
      checkpoints {
        distance
        position
        cutOffTime
      }
    }
    checkpointByEventId(eventId: $eventId) {
      position
      time
      slug
      userId
      _id
      user{
          name
          bib
      }
    	
    }
  }
`

function calcTime(before, current){
  const curTime = moment(current)
  const beforeTime = moment(before)
  const diff = curTime.diff(beforeTime)
  const duration = moment.duration(diff)
  return moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
}

function calcPace(time, distance) {
  const minutes = (time.hour()*60) + time.minute() + (time.second() / 60)
  const paceResult = minutes / distance
  const paceTime = moment.utc().startOf('day').add({ minutes: paceResult }).format('mm:ss')
  return paceTime
}

function buildData({ startTime, haveChipTime, checkpoints }, checkpointsData) {
  const results = []
  // const times = []
  for (const [key, value] of Object.entries(checkpointsData)) {
    if (key !== 'null') {
      const result = {
        bib: key
      }
      const checkpointsInfo = checkpoints.map(cp => cp)
      _reverse(value)
      const data = _unionBy(value, ({ position }) => position)
      const sortedData = _sortBy(data, e => e.position)
      let defaultTime = startTime
      
      if (haveChipTime) {
        const startPosition = sortedData.shift()
        checkpointsInfo.shift()
        if (startPosition.position === 1) {
          defaultTime = startPosition.time
        }
      }
      /* sortedData.reduce((acc, current) => {
        const splitTime = calcTime(defaultTime, current.time)
        result[current.position] = splitTime
        result.name = _get(current, 'runner.name', '-')
        return current.time
      }, defaultTime) */

      sortedData.forEach(data => {
        const splitTime = calcTime(defaultTime, data.time)
        result[data.position] = splitTime
        result.name = _get(data, 'user.name', '-')
        result._id = _get(data, '_id')
      })

      checkpointsInfo.forEach(({ position, distance }, index) => {  // รวมเวลาทั้งหมดไว้ใน array
        if (!result[position]) {
          result.gunTime = 'DNF'
          result.chipTime = 'DNF'
          result.avgPace = '-'
          return
        }
        if (distance === 0) {
          result[`pace${position}`] = '-'
          return
        }
        const time = moment(result[position], 'HH:mm:ss')
        // const minutes = (time.hour()*60) + time.minute() + (time.second() / 60)
        // const paceResult = minutes / distance
        const paceTime = calcPace(time, distance) //moment.utc().startOf('day').add({ minutes: paceResult }).format('H:mm:ss')
        /* console.log({ 
          distance,
          result: result[position],
          minutes,
          paceResult,
          paceTime
        }) */
        result[`pace${position}`] = paceTime
      })
      if (result.gunTime !== 'DNF') {  // คำนวนเวลาทั้งหมด
        const { position, distance } = _last(checkpointsInfo)
        const lastData = sortedData.find(d => d.position === position)
        // const totalTime = times.slice(1).reduce((prev, cur) => moment.duration(cur).add(prev), moment.duration(times[0]))
        // const gunTime = moment.utc(totalTime.asMilliseconds()).format("HH:mm:ss")
        const chipTime = calcTime(defaultTime, lastData.time)
        result.avgPace = calcPace(moment(chipTime, 'HH:mm:ss'), distance)
        result.gunTime = calcTime(startTime, lastData.time)
        result.chipTime = chipTime //calcTime(defaultTime, lastData.time)
      } 

      results.push(result)
    }
  }

  return results
}

function sortRank(data) {
  const dnfData = data.filter(({ gunTime }) => gunTime === 'DNF')
  const finishData = data.filter(({ gunTime }) => gunTime !== 'DNF')
  const orderedData = _orderBy(finishData, o => moment(o.gunTime, 'HH:mm:ss'), ['asc'])
  const orderedDataWithPos = orderedData.map((data, index) => ({...data, pos: index+1}))
  // console.log('orderedDataWithPos', orderedDataWithPos)
  return orderedDataWithPos.concat(dnfData)
}

function PublicBoard(props) {
  const { eventId } = useParams()
  const { data, loading } = useQuery(GET_EVENT_AND_CHECKPOINT, { variables: { eventId }, fetchPolicy: 'network-only'})
  const role = clientAuth.login().role
  const history = useHistory()

  const [allLoading, setLoading] = useState(false)

  const [deleteCheckPoint] = useMutation(deleteCheckPointMutation)

  if (loading) return <div>loading...</div>
  const { raceById: event , checkpointByEventId: checkpoints } = data
  const checkpointsInfo = event.checkpoints.map(cp => cp)
  checkpointsInfo.pop()
  if (event.haveChipTime) {
    checkpointsInfo.shift()
  }
  
  const columnsCheckpoint = checkpointsInfo.map((cp, index) => ({
    title: `เช็คพอยท์ ${index+1} (${cp.distance})`,
    dataIndex: cp.position,
    key: cp.position,
    render: (time, record) => {
      if (!time) {
        return '-'
      }
      const place = record[`pace${cp.position}`]
      return `${time} \n (${place})`
    }
  }))

  const onConfirmDelete = (id) => {
    setLoading(true)
    deleteCheckPoint({
      variables: {
        _id: id
      }
    }).then(res => 
      Modal.success({
        title: 'Updated',
        onOk: () => {
          setLoading(false)
          history.replace(`/fetchPage?link=/events/${eventId}/result`)
        }
      })
    ).catch(err => {
      setLoading(false)
      console.log(err)
    })

  }

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'pos',
      key: '_id',
      render: pos => pos || '-'
    },
    {
      title: 'เลขบิบ',
      dataIndex: 'bib',
      key: 'bib'
    },
    {
      title: 'ชื่อ-สกุล',
      dataIndex: 'name',
      key: 'name'
    },
    ...columnsCheckpoint,
    {
      title: 'Chip Time',
      dataIndex: 'chipTime',
      key: 'chipTime'
    },
    {
      title: 'Gun Time',
      dataIndex: 'gunTime',
      key: 'gunTime'
    },
    {
      title: 'AVG Pace',
      dataIndex: 'avgPace',
      key: 'avgPace'
    },
    {
      title: 'ลบ',
      dataIndex: '_id',
      key: 'status',
      render: (status, record) => (<React.Fragment>
        <div style={{marginTop: 5}}>
          <Popconfirm 
            title="Are you sure？" 
            icon={<QuestionCircleOutlined 
            style={{ color: 'red' }} />} 
            onConfirm={e => onConfirmDelete(record._id)}
            disabled={allLoading}
          >
            <Button style={{ fontSize: 10, padding: '0 4px' }} danger>ลบ</Button>
          </Popconfirm>
        </div>
        </React.Fragment>
      )
    }
  ]
  
  const groupedCheckpoints = _groupBy(checkpoints, cp => cp.user.bib)
  let dataSource = buildData(event, groupedCheckpoints)
  dataSource = sortRank(dataSource)
  return (
    <Layout>
      <Layout.Content>
        <Space style={{ width: '100%' }} direction="vertical">
          <h1>ผลการแข่งขันงาน {event.name}</h1>
          {_includes(role, 'ADMIN') && <Button onClick={() =>  props.history.replace(`/events/${eventId}/checkpoint`)}>add finisher</Button>}
          <Table rowKey={record => record.bib} columns={columns} dataSource={dataSource} pagination={{ pageSize: 100 }} />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default PublicBoard