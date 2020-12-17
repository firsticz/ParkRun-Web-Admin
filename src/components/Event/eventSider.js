import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import _includes from 'lodash/includes'
import compose from 'lodash/flowRight'
import { useQuery } from '@apollo/react-hooks'
import _get from 'lodash/get'

import { Menu, Layout } from 'antd'
import { TeamOutlined, FormOutlined, LineChartOutlined } from '@ant-design/icons'
import eventQuery from '../../graphql/queries/eventOne'
import clientAuth from '../../utils/clientAuth'

const { Sider } = Layout


const EventSider = (props) => {
  const { match } = props
  const { eventId } = match.params

  const eventProps = useQuery(eventQuery, {
    variables: {
      _id: eventId
    }
  })
  const eventLoading = _get(eventProps, 'loading')
  const event = _get(eventProps, 'data.eventOne')

  const pathname = match.path.split('/')
  const {role} = clientAuth.login()

  if (eventLoading) {
    return <div>...loading</div>
  } 
  if(!event){
    return 'event not found'
  }
  console.log(role)
  // else if (!(admin && event)) {
  //   return 'admin or event not found'
  // }

  return (
    <Sider
      width={200}
      style={{ background: '#fff' }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['/']}
        defaultOpenKeys={['sub1']}
        selectedKeys={[pathname[3]]}
        style={{ height: '100%' }}
      >
        { _includes(role, 'ADMIN') && <Menu.Item key="races">
          <NavLink to={`/events/${eventId}/createrace`}>
            <TeamOutlined style={{fontSize: 16, color: '#314659'}} />
              สร้างงานวิ่งย่อย
          </NavLink>
        </Menu.Item>}
        <Menu.Item key="registrations">
          <NavLink to={`/events/${eventId}/registrations`}>
            <TeamOutlined style={{fontSize: 16, color: '#314659'}} />
              ใบสมัคร
          </NavLink>
        </Menu.Item>
        <Menu.Item key="edit">
          <NavLink to={`/events/${eventId}/edit`}>
            <FormOutlined style={{fontSize: 16, color: '#314659'}} />
              แก้ไขสนามวิ่ง
          </NavLink>
        </Menu.Item>
        {/* <Menu.Item key="stats">
          <NavLink to={`/events/${eventId}/stats`}>
            <LineChartOutlined style={{fontSize: 16, color: '#314659'}} />
              สถิติการสมัคร
          </NavLink>
        </Menu.Item> */}
        <Menu.Item key="result">
          <NavLink to={`/events/${eventId}/races`}>
            <LineChartOutlined style={{fontSize: 16, color: '#314659'}} />
              ผลการแข่งขัน
          </NavLink>
        </Menu.Item>

      </Menu>
    </Sider>
  )
}

export default compose(
  withRouter
)(EventSider)
