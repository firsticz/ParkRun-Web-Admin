import React, { Component, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Table, Icon, Tooltip, Input, Spin, Layout, Tag, Dropdown, Menu, Button, Modal, Row, Col } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import moment from 'moment'
import 'moment/locale/th'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import racesQuery from '../../graphql/queries/races'
import updateRaceStatus from '../../graphql/mutations/updateRaceStatus'
import addRacesByAdmin from '../../graphql/mutations/addRacesByAdmin'
const Search = Input.Search
moment.locale('th')

const RaceList = (props) => {
  const [searchkey, setSearchKey] = useState('')
  const history = useHistory()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750)
  const [loading, setLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const { eventId } = useParams()
  // state = {
  //   searchKey: '',
  //   isMobile: window.innerWidth <= 750
  // }

  //const { data, loading, history } = this.props
  const raceMany = useQuery(racesQuery, {
    variables: {_id: eventId},
    fetchPolicy: 'network-only',
  })
  const [raceUpdateById] = useMutation(updateRaceStatus)
  const [createRaceByAdmin] = useMutation(addRacesByAdmin)
  // const { isMobile } = this.state
  let races
  // let onRowClick

  if(raceMany.loading){
    return <Spin />
  }
  const searchKey = searchkey.toLowerCase().replace(/\s/g, '')
  if (!raceMany.loading && raceMany.data.raceMany) {
      races = _orderBy(raceMany.data.raceMany.filter(event => !event.legacy), ['startTime'], ['desc'])
      races = races.filter(race => {
      const e = !![race.slug, race.name].find(
        k => {
          return k.toLowerCase().replace(/\s/g, '').search(searchKey) !== -1
        }
      )
      return e
    })
  }
  const handleModalMobile = (key, id) => {
    const lowerKey = key.toLowerCase()
    if(lowerKey) {
      setLoading(true)
      raceUpdateById({
        variables: {
          record: {
            _id: id,
            status: key
          }
        }
      }).then(res => 
          Modal.success({
            title: 'Updated',
            onOk: () => {
              setLoading(false)
              history.replace(`/races`)
              raceMany.refetch({eventId: eventId})
            }
          })
        ).catch(err => {
          setLoading(false)
          console.log(err)
        })
    }
  }

  const createRaces = () => {
    setAddLoading(true)
    createRaceByAdmin().then(res =>
        Modal.success({
          title: 'Created',
          onOk: () => {
            setAddLoading(false)
            history.replace(`/races`)
            raceMany.refetch({eventId: eventId})
          }
        })
      ).catch(err => {
        setLoading(false)
        console.log(err)
      })
  }

  const column = [
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'Slug'
    },
    {
      mobile: true,
      title: 'name',
      // dataIndex: 'name',
      key: 'name',
      render: (record) =>
        <Tooltip placement="bottom" title={_get(record, 'name')}>
          {isMobile && <TagsOutlined />} {_get(record, 'name')}
        </Tooltip>
    }, {
      title: 'วันที่',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime) => moment(startTime).format('LLLL')
    },
    , {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (<React.Fragment>
        <span style={{ whiteSpace: 'pre-line' }}>
          {status==='open'? <Tag color="green">open</Tag>: <Tag color="red">close</Tag>}
        </span>
        <div style={{marginTop: 5}}>
          <Dropdown disabled={moment().isAfter(moment(record.startTime))} placement="topCenter" overlay={
            <Menu onClick={({ item, key, keyPath }) => handleModalMobile(key, record._id)}>
              <Menu.Item key="open">
                  เปิด
              </Menu.Item>
              <Menu.Item key="close">
                  ปิด
              </Menu.Item>
            </Menu>}
          >
            <Button size="small" style={{ fontSize: 10, padding: '0 4px' }}>แก้ไข</Button>
          </Dropdown>
        </div>
        </React.Fragment>
      )
    }
  ]

  return (
    <Layout>
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} md={6}>
            <Search
              placeholder="ค้นหา"
              onChange={ e => setSearchKey(e.target.value)}
              style={!isMobile ? { width: '388px', margin: '8px' } : null}
            />
          </Col>
          <Col xs={24} md={{ span: 3, offset: 1 }}>
            <Button style={!isMobile ? { margin: '8px' } : null} loading={addLoading} onClick={ ()=> createRaces() }>เพิ่มงานวิ่งทั้งหมด</Button>
          </Col>
          <Col xs={24} md={{ span: 3 }}>
            <Button style={!isMobile ? { margin: '8px' } : null} onClick={ () => history.replace(`/races/create`) } >เพิ่มงานวิ่ง (งานที่ไม่เคยจัดวิ่ง)</Button>
          </Col>
        </Row>
        

        <Table
          style={{whiteSpace: 'nowrap', background: '#fff'}}
          scroll={{ x: true }}
          columns={column}
          dataSource={races}
          loading={raceMany.loading}
          locale={{emptyText: 'ไม่มีข้อมูล'}}
          rowKey={record => record._id}
          pagination={{
              defaultPageSize: 50
          }}
        />
      </Layout.Content>
    </Layout>
  )
  
}
export default RaceList