import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { Table, Layout } from 'antd'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import EventSider from './eventSider'
import getRegistration from '../../graphql/queries/getRegistrations'
import '../../style/responsive-table.css'
import '../../style/EventRegistrations.css'



const EventRegistrations = () => {
  const { eventId } = useParams()
  const regis = useQuery(getRegistration, {
    variables: {eventId: eventId}
  })

  if(regis.loading){
    return <p>loading .....</p>
  }

  const registrations = regis.data.regisMany
  const runnerRegistrations = _filter(registrations, {'regisType': 'runner'})
  const valunteerRegistrations = _filter(registrations, {'regisType': 'valunteer'})
  const columns = [{
    title: '_id',
    dataIndex: '_id',
    key: '_id',
  }, {
    title: 'ชื่อผู้สมัคร',
    dataIndex: 'user',
    key: 'user',
    render: (user) => user.name
  }, {
    title: 'เพศ',
    dataIndex: 'user',
    key: 'user.gender',
    render: (user) => user.gender === 'male'? 'ชาย': 'หญิง'
  }, {
    title: 'สถานะ',
    dataIndex: 'status',
    key: 'status',
  }]

  return (
    <Layout>
      <EventSider />
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        <div className="wrap-name">
          นักวิ่ง
        </div>
        <Table
          columns={columns}
          dataSource={runnerRegistrations}
          loading={regis.loading}
          locale={{ emptyText: 'ไม่มีข้อมูล' }}
          size={'small'}
          rowKey={'_id'}
          //scroll={isMobile ? {} : { x: 1200, y: 800 }}
          // pagination={{
          //     defaultPageSize: perPage,
          //     showQuickJumper: true,
          //     defaultCurrent: 1,
          //     current: currentPage,
          //     total: itemCount,
          //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          //     onChange: this.handlePageChange
          //   }}
          />
          <div className="wrap-name" /* style={{float: 'left', marginLeft: '20px', padding: '6px', fontSize: '2em'}} */>
          อาสาสมัคร
        </div>
        <Table
          columns={columns}
          dataSource={valunteerRegistrations}
          loading={regis.loading}
          locale={{ emptyText: 'ไม่มีข้อมูล' }}
          size={'small'}
          rowKey={'_id'}
          //scroll={isMobile ? {} : { x: 1200, y: 800 }}
          // pagination={{
          //     defaultPageSize: perPage,
          //     showQuickJumper: true,
          //     defaultCurrent: 1,
          //     current: currentPage,
          //     total: itemCount,
          //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          //     onChange: this.handlePageChange
          //   }}
          />
      </Layout.Content>
    </Layout>
  )

}

export default EventRegistrations