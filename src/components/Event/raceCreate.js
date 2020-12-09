import React, { Component, useState } from 'react'
import { graphql } from 'react-apollo'
import { useParams,useHistory } from 'react-router-dom'
import compose from 'lodash/flowRight'
import _get from 'lodash/get'
import {
  Space,
  Input,
  Button,
  Select,
  DatePicker,
  Switch,
  Modal,
  InputNumber,
  Tabs,
  Radio,
  Divider,
  Form,
  message,
} from 'antd'
// import { Form } from '@ant-design/compatible'
import { TagsOutlined } from '@ant-design/icons'
import _orderBy from 'lodash/orderBy'
import racesQuery from '../../graphql/queries/races'
import EventSider from './eventSider'
import { SaveOutlined } from '@ant-design/icons'
import _includes from 'lodash/includes'
import { useQuery, useMutation } from '@apollo/react-hooks'
import updateEventMutation from '../../graphql/mutations/updateEvent'
import CREATE_RACE from '../../graphql/mutations/createRace'
import clientAuth from '../../utils/clientAuth'
import client from '../../index'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}
const RaceCreate = (props) => {
  const { event } = props
  const { eventId ,race} = useParams()
  const [createRace] = useMutation(CREATE_RACE)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  // const { getFieldDecorator, getFieldValue } = form
  const handleSubmit = async (value) => {
    let isExist = false
    if (!value.name) {
      message.success('เข้าแล้ว')
    }
    const record = {
      name: value.name,
      slug: value.slug,
      startTime: value.dateTime[0],
      endTime: value.dateTime[1],
      haveChipTime: value.haveChipTime || false,
      checkpoints: value.checkpoints && value.checkpoints.map((cp, index) => ({
        position: index+1,
        cutOffTime: cp.cutOffTime,
        name: cp.name,
        distance: cp.distance
      }))
    }
    if (isExist) return
    const prepareData = {
      race
    }
     try {
        const {data} = await createRace({variables: { record }})
        Modal.success({ content: 'สร้างกิจกรรมสำเร็จ', onOk: () => history.push(`/event`)})
      } catch (err) {
        throw err
      }
      return
    console.log(record);
    // e.preventDefault()
    // setLoading(true)
    // aleart()
    // const record = {
    //   name: value.name,
    //   slug: value.slug,
    //   organizId: organizId,
    //   startTime: value.dateTime[0],
    //   endTime: value.dateTime[1],
    //   haveChipTime: value.haveChipTime || false,
    //   checkpoints: value.checkpoints && value.checkpoints.map((cp, index) => ({
    //     position: index+1,
    //     cutOffTime: cp.cutOffTime,
    //     name: cp.name,
    //     distance: cp.distance
    //   }))
    // form.validateFieldsAndScroll((err, record) => {
    //   if (err) {
    //     setLoading(false)
    //     return console.error(err)
    //   }
    //   else{
    //     CreateRace({
    //       variables: {
    //         record: {
    //           ...record
    //         }
    //       }
    //     }).then(res => 
    //         Modal.success({
    //           title: 'Created',
    //           onOk: () => {
    //             setLoading(false)
    //             props.history.push(`/fetchPage?link=/events/${race._id}/edit`)
    //           }
    //         })
    //       ).catch(err => {
    //         setLoading(false)
    //         console.log(err)
    //       })
    //   }
    // })
  }
  return (
    <Form 
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      form={form}>
      <h2>สร้างงานวิ่งย่อย</h2>
        {/* <Form.Item 
          {...formItemLayout} 
          label="ไอดีงาน" 
          hasFeedback
          rules={
            [{
              required: true, message: 'กรุณากรอกข้อมูล'
            }]
          }
        >
          <Input value={eventId} disabled />
        </Form.Item> */}
        <Form.Item 
          {...formItemLayout} 
          label="ชื่องาน" 
          hasFeedback 
          name="name"
          rules={
            [{
              required: true, message: 'กรุณากรอกข้อมูล'
            }]
          }
        >
          <Input />
        </Form.Item>
        <Form.Item 
          {...formItemLayout} 
          label="slug งาน" 
          hasFeedback 
          rules={
            [{
              required: true, message: 'กรุณากรอกข้อมูล'
            }]
          }
        >
          <Input />
        </Form.Item>
        <Form.Item 
          {...formItemLayout} 
          label="เวลาเริ่ม-สิ้นสุด" 
          hasFeedback
          rules={
            [{
              required: true, message: 'กรุณากรอกข้อมูล'
            }]
          }
        >
            <DatePicker.RangePicker placeholder={['เวลาเริ่มต้นการแข่งขัน', 'เวลาจบการแข่งขัน']} showTime />
        </Form.Item>
        <Form.List name="checkpoints" {...formItemLayout}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field) => (
                      <div key={field.key}>
                          <Form.Item 
                            {...formItemLayout}
                            // {...field}
                            label={`เช็คพอยท์ ${field.fieldKey + 1}`}
                            name={[field.name, 'cutOffTime']}
                            fieldKey={[field.fieldKey, 'cutOffTime']}
                            rules={
                              [{
                                required: true, message: 'กรุณากรอกข้อมูล'
                              }]
                            }
                          >
                            <DatePicker placeholder="เวลาตัดรอบของเช็คพอยท์" showTime />
                          </Form.Item>
                        <Form.Item 
                          {...formItemLayout}
                          // {...field}
                          label={`ชื่อเช็คพอยท์ที่ ${field.fieldKey + 1}`}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={
                            [{
                              required: true, message: 'กรุณากรอกข้อมูล'
                            }]
                          }
                        >
                          <Input placeholder="ชื่อเช็คพอยท์" />
                        </Form.Item>
                        <Form.Item
                          {...formItemLayout}
                          // {...field}
                          label='ระยะทาง (km.)'
                          value ={5}
                          name={[field.name, 'distance']}
                          fieldKey={[field.fieldKey, 'distance']}
                        >
                          <Input value={5} placeholder="5" disabled />
                        </Form.Item>
                      </div>
                    ))}
                    <Form.Item
                      wrapperCol={{ span: 14, offset: 8 }}
                    >
                      <Space>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                        >
                          เพิ่มเช็คพอยท์
                        </Button>
                        {fields.length !== 0
                        ? <Button
                          type="danger"
                          onClick={() => remove(fields.length-1)}
                        >
                          ลบเช็คพอยท์
                        </Button>
                        : null}
                      </Space>
                    </Form.Item>
                  </>
                )
              }}
            </Form.List>
        {/* {_includes(role, 'ADMIN') && <Form.Item {...formItemLayout} label="approved" hasFeedback>
          {getFieldDecorator('approved', {
            initialValue: _get(event, 'approved'),
            rules: [{ required: true, message: 'approved' }]
          })(
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Select.Option key={"approve"} value={"approve"}>approve</Select.Option>
              <Select.Option key={"reject"} value={"reject"}>reject</Select.Option>
              <Select.Option key={"waiting"} value={"waiting"}>waiting</Select.Option>
              
            </Select>
          )}
        </Form.Item>} */}
         <Form.Item
            wrapperCol={{ span: 14, offset: 8 }}
          >
        <Button
            onClick={handleSubmit}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
          >
            บันทึก
          </Button>
        </Form.Item>
    </Form>
  )
}
export default RaceCreate