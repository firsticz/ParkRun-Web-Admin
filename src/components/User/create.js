import React from 'react'
import { Layout, Form, Input, Typography, Button, Upload, message, Row, Col, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import papa from 'papaparse'
import Promise from 'bluebird'

import ADD_USERS from '../../graphql/mutations/addUsers'
import GET_USERS from '../../graphql/queries/getUser'
import client from '../../index'


function AddUser() {
  const [addUsers] = useMutation(ADD_USERS)
  const history = useHistory()

  const handleAddUser = async (value) => {
    let isExist = false
    if (!value.users) {
      return
    }
    const users = value.users.filter(user => user.email)
    await Promise.each(users, async user => {
      const { data: { userOne }} = await client.query({ query: GET_USERS, variables: { email: user.email }})
      if (userOne) {
        message.error(`มีผู้ใช้ ${user.email} แล้ว`)
        isExist = true
      }
    })

    if (isExist) return
    const prepareData = {
      users
    }
    try {
      const { data } = await addUsers({ variables: prepareData})
      message.success(`เพิ่ม ${data.addUsers.length} ผู้ใช้สำเร็จ`)
      history.push(`/users`)
    } catch (e) {
      console.error(e);
    }
    
  }
  
  const handleBeforeUpload = (file, add) => {
    const reader = new FileReader();
    reader.onload = e => {
      const { result } = e.target
      let { data: users} = papa.parse(result, { header: true })
      console.log(users);
      users
        .filter(user => user.email !== "")
        .forEach(async user => {
          add({
            email: user.email,
            password: user.password,
            idcard: user.idcard,
            phone: user.phone,
            name: user.name
          })
        })
    };
    reader.readAsText(file);
    return false;
  }
  
  return (
    <Layout>
      <h2
      style={{ color:'rgba(0, 0, 0, 0.85)'}}
      >
        เพิ่มสมาชิก
      </h2>
      <Layout.Content>
        <Form
          onFinish={handleAddUser}
        >
          <Form.List name="users">
            {(fields, { add, remove }) => {
              return (
                <div>
                  <Row>
                    <Space>
                      <Col>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                          >
                            เพิ่มผู้ใช้
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item>
                          <Upload
                            showUploadList={false}
                            beforeUpload={file => handleBeforeUpload(file, add)}
                          >
                            <Button icon={<UploadOutlined />}>นำเข้าด้วยไฟล์ CSV</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Space>
                  </Row>
                  {fields.map((field, index) => (
                    <Row key={index} gutter={8}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label="อีเมล"
                          name={[field.name, 'email']}
                          fieldKey={[field.fieldKey, 'email']}
                          rules={
                            [{
                              required: true, message: 'กรุณากรอกข้อมูล'
                            }]
                          }
                        >
                          <Input placeholder="ใส่อีเมล" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label="รหัสผ่าน"
                          name={[field.name, 'password']}
                          fieldKey={[field.fieldKey, 'password']}
                          rules={
                            [{
                              required: true, message: 'กรุณากรอกข้อมูล'
                            }]
                          }
                        >
                          <Input placeholder="ใส่รหัสผ่าน" />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button 
                          type="danger"
                          onClick={() => remove(field.fieldKey)}
                        >
                          x
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </div>
              )
            }}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  )
}

export default AddUser