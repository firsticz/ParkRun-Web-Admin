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
import updateUserMutation from '../../graphql/mutations/updateUser'
import clientAuth from '../../utils/clientAuth'
import ResizeUploader from '../resizeImageUploader'
import { resetApolloContext } from '@apollo/client'
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
  const [approveChange, setApproveChange] = useState(false)
  const [eventUpdateById] = useMutation(updateEventMutation)
  const [userUpdateById] = useMutation(updateUserMutation)

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
        }).then(async (res) => {
          if(approveChange && record.approved === 'approve'){
            await userUpdateById({
              variables: {
                record: {
                  _id: res.data.eventUpdateById.record.organizId,
                  role: 'ORGANIZER'
                }
              }
            })
          }
          Modal.success({
            title: 'Updated',
            onOk: () => {
              setLoading(false)
              props.history.push(`/fetchPage?link=/events/${event._id}/edit`)
            }
          })

        }
            
          ).catch(err => {
            setLoading(false)
            console.log(err)
          })
      }
    })
  }

  const level = [
    {
      value: 'every',
      label: 'จัดทุกสัปดาห์',
    },
    {
      value: 'twice',
      label: 'จัดเดือนละ 2 ครั้ง (จัดวันเสาร์แรกและเสาร์สามของเดือน)',
    },
    {
      value: 'onec',
      label: 'จัดเดือนละ 1 ครั้ง (จัดวันเสาร์แรก)',
    }
  ]

  const regionList = [
    {
      value: 'ภาคเหนือ',
      label: 'ภาคเหนือ',
    },
    {
      value: 'ภาคตะวันออกเฉียงเหนือ',
      label: 'ภาคตะวันออกเฉียงเหนือ',
    },
    {
      value: 'ภาคตะวันตก',
      label: 'ภาคตะวันตก',
    },
    {
      value: 'ภาคกลาง',
      label: 'ภาคกลาง',
    },
    {
      value: 'ภาคตะวันออก',
      label: 'ภาคตะวันออก',
    },
    {
      value: 'ภาคใต้',
      label: 'ภาคใต้',
    },
  ]

  const handleApproveChange = (e) => {
    if(e === 'approve'){
      setApproveChange(true)
    }
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
        {_includes(role, 'ADMIN') && <Form.Item {...formItemLayout} label="URL slug" hasFeedback>
          {getFieldDecorator('slug', {
            initialValue: _get(event, 'slug'),
            rules: [{ required: true, message: 'กรุณากรอก slug' }]
          })(
            <Input />
          )}
        </Form.Item>}
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
        <Form.Item {...formItemLayout} label="แนะนำสนามวิ่ง" hasFeedback>
          {getFieldDecorator('description', {
            initialValue: _get(event, 'description'),
            rules: [{ required: true, message: 'กรุณากรอก แนะนำสนามวิ่ง' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="จัดวันวิ่ง" hasFeedback>
          {getFieldDecorator('levels', {
            initialValue: _get(event, 'levels'),
          })(
            <Select
              placeholder="เลือก จัดวันวิ่ง"
            >
              {level && level.map((le) => (
                <Select.Option  value={le.value}>{le.label}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="ภาค" hasFeedback>
          {getFieldDecorator('region', {
            initialValue: _get(event, 'region'),
          })(
            <Select
              placeholder="เลือก ภาค"
            >
              {regionList && regionList.map((le) => (
                <Select.Option  value={le.value}>{le.label}</Select.Option>
              ))}
            </Select>
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
        <Form.Item {...formItemLayout} label="อัพโหลดรูปหน้าปกสนามวิ่ง ขนาด 300x200 px">
          {getFieldDecorator('image', {
            initialValue: _get(event, 'image'),
          })(
            <ResizeUploader dimension={1198}/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="อัพโหลดรูปเพจสนามวิ่ง ขนาด 1300x400 px">
          {getFieldDecorator('banner', {
            initialValue: _get(event, 'banner'),
          })(
            <ResizeUploader dimension={1198}/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="อัพโหลดรูปแผนที่วิ่งของสนาม ขนาด 750x300 px">
          {getFieldDecorator('eventRoute', {
            initialValue: _get(event, 'eventRoute'),
          })(
            <ResizeUploader dimension={1198}/>
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
              onChange={e => handleApproveChange(e)}
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