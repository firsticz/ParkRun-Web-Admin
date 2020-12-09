import React, { Component } from 'react'
import {
  Link
} from 'react-router-dom'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { Table, Icon, Tooltip, Input, Spin } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import eventsQuery from '../../graphql/queries/events'
import clientAuth from '../../utils/clientAuth'
const Search = Input.Search

class EventList extends Component {
  state = {
    searchKey: '',
    isMobile: window.innerWidth <= 750
  }
  render () {
    const { data, loading, history } = this.props
    const { isMobile } = this.state
    const role = clientAuth.login().role
    let events
    // let onRowClick
    const searchKey = this.state.searchKey.toLowerCase().replace(/\s/g, '')
    if (!loading && data.eventMany) {
      events = _orderBy(this.props.data.eventMany.filter(event => !event.legacy), ['startTime'], ['desc'])
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
        render: (record) => record ? record : 'waiting or reject'
      },
      {
        title: 'ชื่อผู้ดูแล',
        dataIndex: 'organizName',
        key: 'organizName'
      },
    ]

    if(loading){
      return <Spin></Spin>
    }

    return (
      <div>
        <Search
          placeholder="ค้นหา"
          onChange={ e => this.setState({searchKey: e.target.value})}
          style={!isMobile ? { width: '388px', margin: '8px' } : null}
        />
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
          loading={loading}
          locale={{emptyText: 'ไม่มีข้อมูล'}}
          rowKey={record => record._id}
          pagination={{
            defaultPageSize: 50
          }}
        />
      </div>
    )
  }
}

export default compose(
  graphql(eventsQuery, {
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(EventList)