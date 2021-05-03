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
import updateUserMutation from '../../graphql/mutations/updateUser'
import clientAuth from '../../utils/clientAuth'
import ResizeUploader from '../resizeImageUploader'
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

const UserForm = (props) => {
  const { form, user } = props
  console.log(user);
  const role = clientAuth.login().role
  const { getFieldDecorator } = form
  const [loading, setLoading] = useState(false)
  // const [approveChange, setApproveChange] = useState(false)
  const [userUpdateById] = useMutation(updateUserMutation)
  // console.log(user);

  const handleSubmit = (e) => {
    e.pruserDefault()
    setLoading(true)
    form.validateFieldsAndScroll((err, record) => {
      if (err) {
        setLoading(false)
        return console.error(err)
      }
      if(user) {
        userUpdateById({
          variables: {
            record: {
              _id: user._id,
              ...record
            }
          }
        }
        )
      }
    })
  }

  const gender = [
    {
      value: 'male',
      label: 'ชาย',
    },
    {
      value: 'female',
      label: 'หญิง',
    },
  ]

  // const handleApproveChange = (e) => {
  //   if(e === 'approve'){
  //     setApproveChange(true)
  //   }
  // }

  return (
    <Form>
      {/* {_get(user, '_id') ? <h2>แก้ไขสมาชิก</h2> : <h2>สร้างงานวิ่ง</h2>} */}
        <Form.Item {...formItemLayout} label="ชื่อ-สกุล" hasFeedback>
          {getFieldDecorator('name', {
            initialValue: _get(user, 'name'),
            rules: [{ required: true, message: 'กรุณากรอกชื่อ-สกุล' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="พิกัด GPS สนาม" hasFeedback>
          {getFieldDecorator('bib', {
            initialValue: _get(user, 'bib'),
            rules: [{ required: true, message: 'กรุณากรอก พิกัด' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="ชื่อผู้ดูแล" hasFeedback>
          {getFieldDecorator('phone', {
            initialValue: _get(user, 'phone'),
            rules: [{ required: true, message: 'กรุณากรอก ชื่อผู้ดูแล' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="อีเมลผู้ดูแล" hasFeedback>
          {getFieldDecorator('idcard', {
            initialValue: _get(user, 'idcard'),
            rules: [{ required: true, message: 'กรุณากรอก อีเมลผู้ดูแล' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="แนะนำสนามวิ่ง" hasFeedback>
          {getFieldDecorator('role', {
            initialValue: _get(user, 'role'),
            rules: [{ required: true, message: 'กรุณากรอก แนะนำสนามวิ่ง' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="เพศ" hasFeedback>
          {getFieldDecorator('gender', {
            initialValue: _get(user, 'gender'),
          })(
            <Select
              placeholder="เลือกเพศ"
            >
              {gender && gender.map((le) => (
                <Select.Option  value={le.value}>{le.label}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="รายละเอียดเส้นทาง" hasFeedback>
          {getFieldDecorator('email', {
            initialValue: _get(user, 'email'),
            rules: [{ required: true, message: 'กรุณากรอก รายละเอียดเส้นทาง' }]
          })(
            <TextArea />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="การเดินทาง" hasFeedback>
          {getFieldDecorator('birthDate', {
            initialValue: _get(user, 'birthDate'),
            rules: [{ required: true, message: 'กรุณากรอก การเดินทาง' }]
          })(
            <TextArea />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="ที่อยู่" hasFeedback>
          {getFieldDecorator('emergenPhone', {
            initialValue: _get(user, 'emergenPhone'),
            rules: [{ required: true, message: 'กรุณากรอก ที่อยู่' }]
          })(
            <TextArea />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="จุดปล่อยตัว" hasFeedback>
          {getFieldDecorator('drug', {
            initialValue: _get(user, 'drug'),
            rules: [{ required: true, message: 'กรุณากรอก จุดปล่อยตัว' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="อัพโหลดรูปโปรไฟล์">
          {getFieldDecorator('image', {
            initialValue: _get(user, 'image'),
          })(
            <ResizeUploader dimension={1198}/>
          )}
        </Form.Item>
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
)(UserForm)