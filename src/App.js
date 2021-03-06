import React, { Component, Suspense } from 'react'
import {
  Route,
  Switch,
  Redirect,
  Link
} from 'react-router-dom'
import { AppWrapper, Logo } from './style'
import logo from './images/logo_parkrun.png';
import './App.css';

import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'

import { Layout, Menu, /* Breadcrumb, */ Dropdown, Spin } from 'antd'
import { BarsOutlined } from '@ant-design/icons'
import clientAuth from './utils/clientAuth'
import Events from './components/Event'
import Users from './components/User'
import FindUser from './components/User/find'
import FetchPage from './components/FetchPage'
import Stats from './components/Stats/stats'
import Races from './components/Race'
import Organizers from './components/Organize'
import Admins from './components/Admin'
import Report from './components/Report'

import _get from 'lodash/get'
import _includes from 'lodash/includes'
import './style/global.css'
import getRoleUser from './graphql/queries/getRoleUser'

class App extends Component {

  handleMenuClick = ({ item, key, keyPath }) => {
    if (key === 'logout') {
      clientAuth.logout()
      //this.props.client.resetStore()
      this.props.history.push('/login')
    }
  }

  render() {
    const roles = _get(this.props, 'role', [])
    const { data, loading } = this.props
    if(loading){
      return <Spin />
    }
    if(_get(data.userOne, 'role') === 'USER'){
      clientAuth.logout()
      this.props.history.push('/login')
    }
    const menuItems = [
      <Menu.Item key="events">
        <Link to="/events">
            สนามวิ่ง
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') && <Menu.Item key="stats">
        <Link to="/stats">
            สถิติระบบ
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') && <Menu.Item key="organizers">
        <Link to="/organizers" >
            ผู้ดูแลสนาม
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') && <Menu.Item key="admins">
        <Link to="/admins">
            ผู้ดูแลระบบ
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') && <Menu.Item key="races">
        <Link to="/races">
          รายการวิ่ง
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') &&
      <Menu.Item key="createUser">
        <Link to="/users" >
          เพิ่มสมาชิก
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') &&
      <Menu.Item key="findUser">
        <Link to="/FindUser" >
          ค้นหาสมาชิก
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') &&
      <Menu.Item key="reports">
        <Link to="/report" >
          ดาวโหลดรายงาน
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') &&
      <Menu.Item key="reportsrunner">
        <Link to="/report/runner" >
          รายงาน
        </Link>
      </Menu.Item>,

    ]
    const menu = (
      <Menu onClick={this.handleMenuClick} >
        {menuItems}
        <Menu.Item key="logout" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.13)' }}>
          ออกจากระบบ
        </Menu.Item>
      </Menu>
    )

    return (
      <AppWrapper>
        <Layout>
          <Layout.Header className="header">
              <Logo style={{justifyContent: 'center',display:'flex'}}>
                <a href="https://parkrunthailand.com/home">
                {/* <a href="https://localhost:8000/home"> */}
                  <img src={logo} alt="Parkrun" className="logo" />
                </a>
              </Logo>
              <Menu
                className="navbar"
                mode="horizontal"
                theme="dark"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' , backgroundColor: '#41aea9', color: '#fff' }}
                onClick={this.handleMenuClick}
              >
                {menuItems}
                <Menu.Item key="logout" style={{ float: 'right'}}>
                  { `${this.props.name} [${this.props.role}]` } ออกจากระบบ
                </Menu.Item>
              </Menu>
              <div className="nav-hamburger">
                <Dropdown overlay={menu} trigger={['click']} >
                  <BarsOutlined style={{ fontSize: 30, color: '#fff' }} />
                </Dropdown>
              </div>
          </Layout.Header>
          <Layout>
            <Layout.Content>
              {/* <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}> */}
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route path="/events" component={Events}/>
                  { _includes(roles, 'ADMIN') && <Route path="/users" component={Users}/> }
                  { _includes(roles, 'ADMIN') && <Route path="/stats" component={Stats}/> }
                  { _includes(roles, 'ADMIN') && <Route path="/races" component={Races}/> }
                  { _includes(roles, 'ADMIN') && <Route path="/organizers" component={Organizers}/> }
                  { _includes(roles, 'ADMIN') && <Route path="/admins" component={Admins}/> }
                  { _includes(roles, 'ADMIN') && <Route path="/findUser" component={FindUser}/> }
                  { _includes(roles, 'ADMIN') && <Route path="/report" component={Report}/> }
                  <Route path="/fetchPage" component={FetchPage}/>
                  {/* <Route path="/events" component={Events}/> */}
                  {/* <Route path="/fetchPage" component={FetchPage}/> */}

                  {/* { _includes(roles, 'admin') && <Route path="/admins" component={Admins} /> }
                  { _includes(roles, 'admin') && <Route path="/eventForms" component={EventForms} /> }
                  { _includes(roles, 'admin') && <Route path="/campaigns" component={Campaigns} /> } */}
                  <Route path="/" render={() => <Redirect to='/events' />} />
                </Switch>
              </Suspense>
            </Layout.Content>
          </Layout>

        </Layout>
      </AppWrapper>
    )
  }
}

export default compose(
  graphql(getRoleUser, {
    options: (props) => ({ 
        variables: { _id: _get(props, 'id', []) },
        fetchPolicy: 'network-only' })
  })
)(App)
