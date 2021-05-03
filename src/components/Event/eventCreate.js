import React, { useEffect, useState } from 'react'
import { 
  Space,
  Layout,
  Form,
  Input,
  Button,
  DatePicker,
  Modal,
  Breadcrumb,
  Switch,
  InputNumber,
  message,
  Tooltip
} from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/react-hooks'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import { useParams, useHistory, Link } from 'react-router-dom'
import addEventByAdmin from '../../graphql/mutations/addEventByAdmin'
import clientAuth from '../../utils/clientAuth'
import moment from 'moment'

function CreateEvent() {
  const role = clientAuth.login().role
  const [createEvent] = useMutation(addEventByAdmin)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750)
  const { eventId, organizId } = useParams()
  const [addLoading, setAddLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const isEdit = !!eventId
  const history = useHistory()

  const handleCreateEvent = async (value) => {
    const record = {
      name: value.name,
      slug: value.slug,
      organizId: organizId,
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
    try {
      await createEvent({variables: { record }})
      Modal.success({ content: 'สร้างกิจกรรมสำเร็จ', onOk: () => history.push(`/events`)})
    } catch (e) {
      throw e
    }
    setAddLoading(true)
  }
  
  const column = [
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'Slug'
    },
    {
      mobile: true,
      title: 'name',
      // dataIndex: 'name',
      key: 'name',
      render: (record) =>
        <Tooltip placement="bottom" title={_get(record, 'name')}>
          <Link to={`/events/${record._id}/registrations`} style={{color: 'inherit', textDecoration: 'none'}}>
            {isMobile && <TagsOutlined />} {_get(record, 'name')}
          </Link>
        </Tooltip>
    },
    {
      title: 'สถานะ',
      key: 'status',
      dataIndex: 'approved',
      render: (record) => record ? record : 'waiting or reject',
      filters: [
        { text: 'approve', value: 'approve' },
        { text: 'waiting', value: 'waiting' },
        { text: 'reject', value: 'reject' },
      ],
      onFilter: (value, record) => record.approved.includes(value),
    },
    {
      title: 'ชื่อผู้ดูแล',
      dataIndex: 'organizName',
      key: 'organizName'
    },
  ]
  
  return (
    <Layout>
      <Space style={{ width: '100%' }} direction="vertical">
        <Breadcrumb>
          {/* <Breadcrumb.Item>
            <Link to={`/event/${organizId}`}>การแข่งขันทั้งหมด</Link>
          </Breadcrumb.Item> */}
          {/* <Breadcrumb.Item>
            {isEdit ? 'แก้ไขการแข่งขัน' : 'เพิ่มการแข่งขัน'}
          </Breadcrumb.Item> */}
        </Breadcrumb>
        {/* <Typography.Title>{isEdit ? 'แก้ไขการแข่งขัน' : 'เพิ่มการแข่งขัน'}</Typography.Title> */}
        <Layout.Content>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 12 }}
            onFinish={handleCreateEvent}
            form={form}
          >
            <Form.Item
              label="ชื่อการแข่งขัน"
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
              label="Slug"
              name="slug"
              rules={
                [{
                  required: true, message: 'กรุณากรอกข้อมูล'
                }]
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="เวลาเริ่ม-สิ้นสุด"
              name="dateTime"
              rules={
                [{
                  required: true, message: 'กรุณากรอกข้อมูล'
                }]
              }
            >
              <DatePicker.RangePicker placeholder={['เวลาเริ่มต้นการแข่งขัน', 'เวลาจบการแข่งขัน']} showTime />
            </Form.Item>
            <Form.Item
              label='คำนวณชิพไทม์'
              name="haveChipTime"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.List name="checkpoints">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field) => (
                      <div key={field.key}>
                          <hr style={{borderTop: '1px dashed #000'}}/>
                          <Form.Item
                            {...field}
                            label={`เช็คพอยท์ ${field.fieldKey + 1}`}
                            name={[field.name, 'cutOffTime']}
                            fieldKey={[field.fieldKey, 'cutOffTime']}
                            rules={
                              [{
                                required: true, message: 'กรุณากรอกข้อมูล'
                              }]
                            }
                          >
                            <DatePicker placeholder="เวลาคัทอ๊อฟ" showTime />
                          </Form.Item>
                        <Form.Item
                          {...field}
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
                          {...field}
                          label='ระยะทาง (km.)'
                          name={[field.name, 'distance']}
                          fieldKey={[field.fieldKey, 'distance']}
                          rules={
                            [{
                              required: true, message: 'กรุณากรอกข้อมูล'
                            }]
                          }
                        >
                          <InputNumber placeholder="ระยะ (km.)" min={0} />
                        </Form.Item>
                      </div>
                    ))}
                    <Form.Item
                      wrapperCol={{ span: 14, offset: 4 }}
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
            <Form.Item
              wrapperCol={{ span: 14, offset: 4 }}
            >
              <Space>
                <Button type="primary" htmlType="submit">{isEdit ? 'บันทึก' : 'สร้างกิจกรรม'}</Button>
                {isEdit && <Button onClick={() => history.push(`/event/${organizId}`)}>ยกเลิก</Button>}
              </Space>
            </Form.Item>
          </Form>
        </Layout.Content>
      </Space>
    </Layout>
  )
}

export default CreateEvent