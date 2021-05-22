import React, { Component, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { Table, Icon, Tooltip, Input, Spin, Layout, Tag, Dropdown, Menu, Button, Modal, Row, Col } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import eventsQuery from '../../graphql/queries/events'
import addEventByAdmin from '../../graphql/mutations/addEventByAdmin'
import clientAuth from '../../utils/clientAuth'
const Search = Input.Search

const EventList = (props) => {
  const [searchKey, setSearchKey] = useState('')
  const history = useHistory()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750)
  const [loading, setLoading] = useState(false)
  // const { data, loading, history } = this.props
  const [addLoading, setAddLoading] = useState(false)
  const { eventId } = useParams()
  const eventMany = useQuery(eventsQuery, {
    // variables: {_id: eventId},
    fetchPolicy: 'network-only',
  })
  const role = clientAuth.login().role
  const [createEventByAdmin] = useMutation(addEventByAdmin)

  let events
  if(eventMany.loading){
    return <Spin />
  }
  // let onRowClick
  if (!eventMany.loading && eventMany.data.eventMany) {
    events = _orderBy(eventMany.data.eventMany.filter(event => !event.legacy), ['startTime'], ['desc'])
    if(_includes(role, 'ORGANIZER')){
      const organizeId = clientAuth.login().id
      console.log(organizeId);
      events = events.filter(event => `${event.organizId}` === `${organizeId}`)
    }
    events = events.filter(event => {
      const e = !![event.slug, event.name].find(
        k => {
          return k.toLowerCase().replace(/\s/g, '').search(searchKey) !== -1
        }
      )
      return e
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
          <Link to={`/events/${record._id}/registrations`} style={{color: 'inherit', textDecoration: 'none'}}>
            {isMobile && <TagsOutlined />} {_get(record, 'name')}
          </Link>
        </Tooltip>
    },
    {
      title: 'สถานะ',
      key: 'status',
      dataIndex: 'approved',
      render: (record) => record ? record : 'waiting or reject',
      filters: [
        { text: 'approve', value: 'approve' },
        { text: 'waiting', value: 'waiting' },
        { text: 'reject', value: 'reject' },
      ],
      onFilter: (value, record) => record.approved.includes(value),
    },
    {
      title: 'ชื่อผู้ดูแล',
      dataIndex: 'organizName',
      key: 'organizName'
    },
  ]

  // if(loading){
  //   return <Spin></Spin>
  // }

  return (
    <Layout>
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={{ span: 3, offset: 1 }}>
            <Search
              placeholder="ค้นหา"
              onChange={ e => setSearchKey(e.target.value)}
              style={!isMobile ? { width: '388px', margin: '8px' } : null}
              />
          </Col>
          {/* <Col xs={24} md={{ span: 3, offset: 1 }}>
            {(_includes(role, 'ADMIN')) &&<Button style={!isMobile ? { margin: '8px' } : null} loading={addLoading} href="/events/create">เพิ่มสนามวิ่ง</Button>}
          </Col> */}
        </Row>
          <Table
            onRow={(record, rowIndex) => {
              // console.log({record})
              return {
                onClick: event => {
                  history.replace(`/events/${record._id}/edit`)
                } // click row
                // onDoubleClick: event => {}, // double click row
                // onContextMenu: event => {}, // right button click row
                // onMouseEnter: event => {}, // mouse enter row
                // onMouseLeave: event => {}, // mouse leave row
              }
            }}
            style={{whiteSpace: 'nowrap', background: '#fff'}}
            scroll={{ x: true }}
            columns={column}
            dataSource={events}
            loading={eventMany.loading}
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

export default EventList
// export default compose(
//   graphql(eventsQuery, {
//     options: {
//       fetchPolicy: 'network-only'
//     }
//   })
// )(EventList)