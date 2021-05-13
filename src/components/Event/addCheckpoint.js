import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import _get from 'lodash/get'
import {
  Input,
  Button,
  Select,
  Modal,
} from 'antd'
import { Layout, Table, Space, TimePicker } from 'antd'
import { Form } from '@ant-design/compatible'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import compose from 'lodash/flowRight'
import _includes from 'lodash/includes'
import moment from 'moment';
import clientAuth from '../../utils/clientAuth'

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

const GET_RACE = gql`
query getRace($eventId: MongoID!){
	raceById(_id: $eventId) {
		_id
		name
		slug
		organizId
		startTime
		endTime
		haveChipTime
		checkpoints {
			distance
			position
			cutOffTime
		}
	}
}
`
const MUTATION_CP = gql`
mutation addCheckpoint($raceId:MongoID!, $bib: String, $time: Date, $bibVolunteer: String, $position: Int){
	checkpointManual(raceId: $raceId, bib: $bib, time: $time, bibVolunteer: $bibVolunteer, position: $position){
		_id
	}
}
`




const AddCheckpoint = (props) => {
	const { eventId } = useParams()
	const { form } = props
  const { getFieldDecorator } = form
	const [loadingSubmit, setLoading] = useState(false)
	const [checkpointManual] = useMutation(MUTATION_CP)
	const { data, loading } = useQuery(GET_RACE, { variables: { eventId }, fetchPolicy: 'cache-and-network'})
	const role = clientAuth.login().role

	if (loading) return <div>loading...</div>
  const { raceById: race } = data

	const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    form.validateFieldsAndScroll((err, record) => {
      if (err) {
        setLoading(false)
        return console.error(err)
      }
			checkpointManual({
				variables: {
						...record
				}
			}).then(async (res) => {
				console.log(res)
				Modal.success({
					title: 'Updated',
					onOk: () => {
						setLoading(false)
						props.history.push(`/fetchPage?link=/events/${eventId}/result`)
					}
				})

			}
					
				).catch(err => {
					console.log(err)
					Modal.error({
						title: 'ไม่สามารถเพิ่มข้อมูลได้',
						content: err.message ,
						onOk: () => {
							setLoading(false)
							props.history.push(`/fetchPage?link=/events/${eventId}/result`)
						}
					})
					
				})

    })
  }

    return(
			<Layout>
				<Layout.Content>
					
				<Space style={{ width: '100%' }} direction="vertical">
					<div style={{display: 'flex', justifyContent:'center'}}>
						<h1>{`สนาม: ${race.name} ${moment(race.startTime).format('LLLL')}`}</h1>
					</div>
					
					<Form>
						<Form.Item {...formItemLayout} label="raceId" hasFeedback>
							{getFieldDecorator('raceId', {
								initialValue: _get(race, '_id'),
								rules: [{ required: true, message: 'raceId' }]
							})(
								<Input disabled />
							)}
						</Form.Item>
						<Form.Item {...formItemLayout} label="เลขบิบนักวิ่ง" hasFeedback>
							{getFieldDecorator('bib', {
								initialValue: null,
								rules: [{ required: true, message: 'กรุณากรอกบิบ' }]
							})(
								<Input />
							)}
						</Form.Item>
						<Form.Item {...formItemLayout} label="เวลาวิ่ง" hasFeedback>
							{getFieldDecorator('time', {
								initialValue: null,
								rules: [{ required: true, message: 'กรุณากรอกเวลาวิ่ง' }]
							})(
								<TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
							)}
						</Form.Item>
						<Form.Item {...formItemLayout} label="เลขบิบอาสาสมัคร" hasFeedback>
							{getFieldDecorator('bibVolunteer', {
								initialValue: null,
								rules: [{ required: true, message: 'กรุณากรอกบิบ' }]
							})(
								<Input />
							)}
						</Form.Item>
						<Form.Item {...formItemLayout} label="position" hasFeedback>
							{getFieldDecorator('position', {
								initialValue: _get(race, 'checkpoints[0].position'),
								rules: [{ required: true, message: 'position' }]
							})(
								<Input disabled />
							)}
						</Form.Item>
						<div style={{display: 'flex', justifyContent:'center'}}>
							{_includes(role, 'ADMIN') && <Button
								onClick={handleSubmit}
								type="primary"
								htmlType="submit"
								loading={loading}
								//icon={<SaveOutlined />}
								>
								บันทึก
							</Button>}
						</div>
						

					</Form>
				</Space>


				</Layout.Content>
			</Layout>
    )

}

export default compose(
	Form.create()
)(AddCheckpoint)