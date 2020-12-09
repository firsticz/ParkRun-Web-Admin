import React, { Component, useState } from 'react'
import {
  Link,
  Route
} from 'react-router-dom'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { useParams, useHistory, Redirect } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Table, List, Tooltip, Tabs, Layout, Dropdown, Menu, Button, Modal, Input, Avatar } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import EventForm from './eventForm'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import EventSider from './eventSider'
import getRegistration from '../../graphql/queries/getRegisManyByRaceId'
import updateRegistration from '../../graphql/mutations/updateRegister'
import addRegister from '../../graphql/mutations/addRegister'
import getUserByBib from '../../graphql/queries/getUserByBib'
import raceById from '../../graphql/queries/raceById'
import '../../style/responsive-table.css'
import '../../style/EventRegistrations.css'
import Search from 'antd/lib/input/Search'
import { Form } from '@ant-design/compatible'

const { TabPane } = Tabs

const EventRegistrations = (props) => {
  const { eventId, raceId } = useParams()
  const { getFieldDecorator } = props.form
  const [loading, setLoading] = useState(false)
  const [searchModal, setSearchModal] = useState(false)
  const [user, setUser] = useState({})
  const history = useHistory()
  const regis = useQuery(getRegistration, {
    variables: {eventId: raceId},
    fetchPolicy: 'cache-and-network',
  }
  )
  const userrole = useQuery(getUserByBib, {
    // variables: {bib: bib},
    //skip: true,
    fetchPolicy: 'cache-and-network',
  })
  const RaceOne = useQuery(raceById, {
    variables: {_id: raceId},
    fetchPolicy: 'cache-and-network',
  })
  const [updateRegis] = useMutation(updateRegistration)
  const [addRegis] = useMutation(addRegister)

  if(regis.loading){
    return <p>loading .....</p>
  }
  if(RaceOne.loading){
    return <p>loading .....</p>
  }

  const registrations = regis.data.regisMany
  const runnerRegistrations = _filter(registrations, {'regisType': 'RUNNER'})
  const valunteerRegistrations = _filter(registrations, {'regisType': 'VALUNTEER'})

  const handleModalMobile = (key, id) => {
    const lowerKey = key.toLowerCase()
    if(lowerKey) {
      setLoading(true)
      updateRegis({
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
              history.replace(`/events/${eventId}/racesregistrations/${raceId}`)
              regis.refetch({eventId: raceId})
            }
          })
        ).catch(err => {
          setLoading(false)
          console.log(err)
        })
    }
    // if (lowerKey === 'submission' || lowerKey === 'payment') {
    //   this.handleEmailModal(key, registration)
    // }
    // if (lowerKey === 'pay') {
    //   this.handleRegistrationBankTransferModalOpen(registration)
    // }
    // if (lowerKey === 'edit') {
    //   this.props.history.push(`/events/${this.props.data.event._id}/registrations/${registration._id}/edit`)
    // }
  }
  const columns1 = [{
    title: 'รูป',
    dataIndex: 'user',
    key: 'user',
    render: (user) => <Avatar size={80} src={`${user.image}`} />
  },{
    title: 'ชื่อผู้สมัคร',
    dataIndex: 'user',
    key: 'user',
    render: (user) => user.name
  }, {
    title: 'เพศ',
    dataIndex: 'user',
    key: 'user.gender',
    render: (user) => user.gender === 'male'? 'ชาย': 'หญิง'
  }]
  const columns2 = [{
    title: 'รูป',
    dataIndex: 'user',
    key: 'user',
    render: (user) => <Avatar size={80} src={`${user.image}`} />
  },{
    title: 'ชื่อผู้สมัคร',
    dataIndex: 'user',
    key: 'user',
    render: (user) => user.name
  }, {
    title: 'เพศ',
    dataIndex: 'user',
    key: 'user.gender',
    render: (user) => user.gender === '' ? '': user.gender === 'male'? 'ชาย': 'หญิง'
  },{
    title: 'เบอร์โทร',
    dataIndex: 'user',
    key: 'user.phone',
    render: (user) => user.phone
  }, {
    title: 'สถานะ',
    dataIndex: 'status',
    key: 'status',
    render: (status, record) => (<React.Fragment>
      <span style={{ whiteSpace: 'pre-line' }}>
        {status==='apporve'? 'อนุมัติแล้ว':status==='waiting'?'รออนุมัติ':'ไม่อนุมัติ'}
      </span>
      <div style={{marginTop: 5}}>
        <Dropdown placement="topCenter" overlay={
          <Menu onClick={({ item, key, keyPath }) => handleModalMobile(key, record._id)}>
            <Menu.Item key="apporve">
                ยืนยัน
            </Menu.Item>
            <Menu.Item key="eject">
                ยกเลิก
            </Menu.Item>
            {/* {registration.status === 'paid' &&
                <Menu.Item key="payment">
                  ชำระเงิน
                </Menu.Item>
            } */}
          </Menu>}
        >
          <Button size="small" style={{ fontSize: 10, padding: '0 4px' }}>คำสั่ง</Button>
        </Dropdown>
      </div>
      </React.Fragment>
    )
  }]

  const handleCancel = () => {
    setSearchModal(false)
    setUser({})
  };

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    props.form.validateFieldsAndScroll(async (err, record) => {
      if (err) {
        setLoading(false)
        return console.error(err)
      }
      const result = await userrole.refetch({bib: Number(record.bib)})
      setUser(result.data.userOne)
      setLoading(false)
      
    })
  }
  const handleOk = () => {
    console.log('test')
  };

  const handleAddRegister = async() => {
    try {
      await addRegis({
        variables: {
          name: RaceOne.data.raceOne.name,
          eventId: `${eventId}`,
          userId: `${user._id}`,
          raceId: `${raceId}`,
          regisType: 'VALUNTEER',
          status: 'apporve'
        },
      })
      .then(res => 
        Modal.success({
          title: 'Updated',
          onOk: () => {
            setLoading(false)
            history.replace(`/events/${eventId}/racesregistrations/${raceId}`)
            regis.refetch({eventId: raceId})
            setSearchModal(false)
            setUser({})
          }
        })
      )
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout>
      <EventSider />
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        <Tabs defaultActiveKey="1" type="card" size={'small'}>
          <TabPane tab="นักวิ่ง" key="1">
            <Table
            columns={columns1}
            dataSource={runnerRegistrations}
            loading={regis.loading}
            locale={{ emptyText: 'ไม่มีข้อมูล' }}
            size={'small'}
            rowKey={'_id'}
            scroll={{ x: true }}
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
          </TabPane>
          <TabPane tab="อาสาสมัคร" key="2">
            <Button type="primary" onClick={()=> setSearchModal(true)}>
                  เพิ่มอาสาสมัคร
            </Button>
          <Modal
            title="เพิ่มอาสาสมัคร"
            visible={searchModal}
            onOk={handleAddRegister}
            //confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                ยกเลิก
              </Button>,
              <Button key="submit" type="primary" loading={loading} disabled={!(user && user.name)} onClick={handleAddRegister}>
                เพิ่มอาสาสมัคร
              </Button>,
            ]}
          >
            {/* <h2>เพิ่มอาสาสมัคร</h2> */}
            <Form style={{ width: '200px', marginTop: '2em' }}  layout="inline">
              <Form.Item>
                {getFieldDecorator('bib', {
                  rules: [{ required: true, message: 'Please input your bib!' }]
                })(
                  <Input  placeholder="bib" />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={(e)=>handleSearch(e)}>
                  ค้นหา
                </Button>
              </Form.Item>

            </Form>
            {user && user.name && <List>
                <List.Item>
                  <List.Item.Meta 
                    avatar={
                      <Avatar size={80} src={`${user.image}`} />
                    }
                    title={`ชื่อ ${user.name}`}
                    description={`BIB: ${user.bib}, เบอร์โทร: ${user.phone}`}
                  />
                </List.Item>
              </List>}
          </Modal>
            
            <Table
            columns={columns2}
            dataSource={valunteerRegistrations}
            loading={regis.loading}
            locale={{ emptyText: 'ไม่มีข้อมูล' }}
            size={'small'}
            rowKey={'_id'}
            scroll={{ x: true }}
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
          </TabPane>
        </Tabs>
        
        
      </Layout.Content>
    </Layout>
  )

}

export default compose(
  Form.create()
)(EventRegistrations)