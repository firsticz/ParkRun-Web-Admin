import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { Table, Input, Spin, Avatar } from 'antd'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import adminQuery from '../../graphql/queries/getAdmins'
import clientAuth from '../../utils/clientAuth'
const Search = Input.Search

class AdminList extends Component {
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
    if (!loading && data.adminList) {
      events = _orderBy(this.props.data.adminList.filter(event => !event.legacy), ['name'], ['desc'])
      if(_includes(role, 'ORGANIZER')){
        const organizeId = clientAuth.login().id
        console.log(organizeId);
        events = events.filter(event => `${event.organizId}` === `${organizeId}`)
      }
      events = events.filter(event => {
        const e = !![event.name].find(
          k => {
            return k.toLowerCase().replace(/\s/g, '').search(searchKey) !== -1
          }
        )
        return e
      })
    }

    const bibNumber = (number) => {
        const pad = '0000000'
        return pad.substr(0, pad.length - `${number}`.length) + number
    }

    const columns = [{
        title: 'รูป',
        dataIndex: 'image',
        key: 'image',
        render: (image) => <Avatar size={80} src={`${image}`} />
      },{
        title: 'เลขบิบ',
        dataIndex: 'bib',
        key: 'bib',
        render: (bib) => bibNumber(Number(bib))
      },{
        title: 'ชื่อผู้สมัคร',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'เพศ',
        dataIndex: 'gender',
        key: 'gender',
        render: (gender) => gender === 'male'? 'ชาย': 'หญิง'
      },{
        title: 'อีเมล',
        dataIndex: 'email',
        key: 'email',
      },{
        title: 'เบอร์โทร',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: 'เบอร์โทรฉุกเฉิน',
        dataIndex: 'emergenPhone',
        key: 'emergenPhone',
      }]

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
          style={{whiteSpace: 'nowrap', background: '#fff'}}
          scroll={{ x: true }}
          columns={columns}
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
  graphql(adminQuery, {
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(AdminList)