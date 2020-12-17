import React, { useState } from 'react'
import _get from 'lodash/get'
import {
  Input,
  Button,
  Select,
  Modal,
} from 'antd'
import { Form } from '@ant-design/compatible'
import { SaveOutlined } from '@ant-design/icons'

import compose from 'lodash/flowRight'
import _includes from 'lodash/includes'
import { useMutation } from '@apollo/react-hooks'
import updateEventMutation from '../../graphql/mutations/updateEvent'
import clientAuth from '../../utils/clientAuth'
const { TextArea } = Input;

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

const EventForm = (props) => {
  const { form, event } = props
  const role = clientAuth.login().role
  const { getFieldDecorator } = form
  const [loading, setLoading] = useState(false)
  const [eventUpdateById] = useMutation(updateEventMutation)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    form.validateFieldsAndScroll((err, record) => {
      if (err) {
        setLoading(false)
        return console.error(err)
      }
      if(event) {
        eventUpdateById({
          variables: {
            record: {
              _id: event._id,
              ...record
            }
          }
        }).then(res => 
            Modal.success({
              title: 'Updated',
              onOk: () => {
                setLoading(false)
                props.history.push(`/fetchPage?link=/events/${event._id}/edit`)
              }
            })
          ).catch(err => {
            setLoading(false)
            console.log(err)
          })
      }
    })
  }

  return (
    <Form>
      {_get(event, '_id') ? <h2>แก้ไขสนามวิ่ง</h2> : <h2>สร้างงานวิ่ง</h2>}
        <Form.Item {...formItemLayout} label="ชื่องานวิ่ง" hasFeedback>
          {getFieldDecorator('name', {
            initialValue: _get(event, 'name'),
            rules: [{ required: true, message: 'กรุณากรอกชื่องานวิ่ง' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="URL slug" hasFeedback>
          {getFieldDecorator('slug', {
            initialValue: _get(event, 'slug'),
            rules: [{ required: true, message: 'กรุณากรอก slug' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="พิกัด GPS สนาม" hasFeedback>
          {getFieldDecorator('address', {
            initialValue: _get(event, 'address'),
            rules: [{ required: true, message: 'กรุณากรอก พิกัด' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="ชื่อผู้ดูแล" hasFeedback>
          {getFieldDecorator('organizName', {
            initialValue: _get(event, 'organizName'),
            rules: [{ required: true, message: 'กรุณากรอก ชื่อผู้ดูแล' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="เบอร์โทรผู้ดูแล" hasFeedback>
          {getFieldDecorator('organizPhone', {
            initialValue: _get(event, 'organizPhone'),
            rules: [{ required: true, message: 'กรุณากรอก เบอร์โทรผู้ดูแล' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="อีเมลผู้ดูแล" hasFeedback>
          {getFieldDecorator('organizEmail', {
            initialValue: _get(event, 'organizEmail'),
            rules: [{ required: true, message: 'กรุณากรอก อีเมลผู้ดูแล' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="description" hasFeedback>
          {getFieldDecorator('description', {
            initialValue: _get(event, 'description'),
            rules: [{ required: true, message: 'กรุณากรอก description' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="รายละเอียดเส้นทาง" hasFeedback>
          {getFieldDecorator('road', {
            initialValue: _get(event, 'road'),
            rules: [{ required: true, message: 'กรุณากรอก รายละเอียดเส้นทาง' }]
          })(
            <TextArea />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="การเดินทาง" hasFeedback>
          {getFieldDecorator('route', {
            initialValue: _get(event, 'route'),
            rules: [{ required: true, message: 'กรุณากรอก การเดินทาง' }]
          })(
            <TextArea />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="ที่อยู่" hasFeedback>
          {getFieldDecorator('location', {
            initialValue: _get(event, 'location'),
            rules: [{ required: true, message: 'กรุณากรอก ที่อยู่' }]
          })(
            <TextArea />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="จุดปล่อยตัว" hasFeedback>
          {getFieldDecorator('startPoint', {
            initialValue: _get(event, 'startPoint'),
            rules: [{ required: true, message: 'กรุณากรอก จุดปล่อยตัว' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="เส้นชัย" hasFeedback>
          {getFieldDecorator('finishPoint', {
            initialValue: _get(event, 'finishPoint'),
            rules: [{ required: true, message: 'กรุณากรอก เส้นชัย' }]
          })(
            <Input />
          )}
        </Form.Item>
        {_includes(role, 'ADMIN') && <Form.Item {...formItemLayout} label="approved" hasFeedback>
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
        </Form.Item>}
        
        <Button
            onClick={handleSubmit}
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            บันทึก
          </Button>
    </Form>
  )
}

export default compose(
  Form.create()
)(EventForm)