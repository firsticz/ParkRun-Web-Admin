import React, { Component } from 'react'
import {
  Link
} from 'react-router-dom'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { Table, Icon, Tooltip, Input, Spin, Layout } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import racesQuery from '../../graphql/queries/races'
import EventSider from './eventSider'
const Search = Input.Search

class EventList extends Component {
  state = {
    searchKey: '',
    isMobile: window.innerWidth <= 750
  }
  render () {
    const { data, loading, history } = this.props
    const { isMobile } = this.state
    let races
    // let onRowClick

    if(loading){
      return <Spin />
    }
    const searchKey = this.state.searchKey.toLowerCase().replace(/\s/g, '')
    if (!loading && data.raceMany) {
        races = _orderBy(this.props.data.raceMany.filter(event => !event.legacy), ['startTime'], ['desc'])
        races = races.filter(race => {
        const e = !![race.slug, race.name].find(
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
            <Link to={`/events/${record._id}/result`} style={{color: 'inherit', textDecoration: 'none'}}>
              {isMobile && <TagsOutlined />} {_get(record, 'name')}
            </Link>
          </Tooltip>
      }
    ]

    return (
      <Layout>
        <EventSider />
        <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
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
                    history.replace(`/events/${record._id}/result`)
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
            dataSource={races}
            loading={loading}
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
}

export default compose(
  graphql(racesQuery, {
    options: (props) => ({ 
        variables: { _id: props.match.params.eventId },
        fetchPolicy: 'network-only' })
  })
)(EventList)