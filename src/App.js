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

import { Layout, Menu, /* Breadcrumb, */ Dropdown } from 'antd'
import { BarsOutlined } from '@ant-design/icons'
import clientAuth from './utils/clientAuth'
import Events from './components/Event'
import Users from './components/User'
import FetchPage from './components/FetchPage'
import Stats from './components/Stats/stats'
import Races from './components/Race'

import _get from 'lodash/get'
import _includes from 'lodash/includes'
import './style/global.css'

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
    const menuItems = [
      <Menu.Item key="events">
        <Link to="/events">
            สนามวิ่ง
        </Link>
      </Menu.Item>,
      // _includes(roles, 'ADMIN') &&
      //   <Menu.Item key="races">
      //     <Link to="/races">
      //       งานวิ่ง
      //     </Link>
      //   </Menu.Item>,
        _includes(roles, 'ADMIN') && <Menu.Item key="stats">
         <Link to="/stats">
             สถิติระบบ
         </Link>
       </Menu.Item>,
      _includes(roles, 'ADMIN') && <Menu.Item key="organizers">
        <Link to="/organizers">
            ผู้จัดงาน
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') && <Menu.Item key="admins">
        <Link to="/admins">
            ผู้ดูแลระบบ
        </Link>
      </Menu.Item>,
      _includes(roles, 'ADMIN') &&
      <Menu.Item key="createUser">
        <Link to="/users">
          createUser
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
              <Logo className="logo">
                <Link to="/">
                  <img src={logo} alt="Parkrun" />
                </Link>
              </Logo>
              <Menu
                className="navbar"
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
                onClick={this.handleMenuClick}
              >
                {menuItems}
                <Menu.Item key="logout" style={{ float: 'right' }}>
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
                  <Route path="/users" component={Users}/>
                  <Route path="/stats" component={Stats}/>
                  <Route path="/races" component={Races}/>
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

export default App;
