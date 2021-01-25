import React, { Component, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Table, Icon, Tooltip, Input, Spin, Layout, Tag, Dropdown, Menu, Button, Modal, Row, Col, Select, Form } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import moment from 'moment'
import 'moment/locale/th'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import eventQuery from '../../graphql/queries/getEventNotRun'
import nextRaceQuery from '../../graphql/queries/getnextRace'
import createRaceMutation from '../../graphql/mutations/createRace'
const Search = Input.Search
moment.locale('th')

const Create = (props) => {
	const history = useHistory()
	const [raceTemp, setRaceTemp] = useState({})
	const [loading, setLoading] = useState(false)

	const [raceCreateOne] = useMutation(createRaceMutation)

	const event = useQuery(eventQuery, {
    fetchPolicy: 'network-only',
	})
	const nextRace = useQuery(nextRaceQuery, {
    fetchPolicy: 'network-only',
	})
	if(event.loading || nextRace.loading){
    return <Spin />
	}

	if(!nextRace.data.nextRace){
		history.replace('/races')
	}

	const events = event.data.eventNotRun
	const race = nextRace.data.nextRace

	const handleSelect = (value, event) => {
		const temp = events.find(e => e._id === value)
		if(!temp){
			history.replace('/races')
		}
		let racetemp = race
		const arrName = race.name.split("_W")
		const arrSlug = race.slug.split("week")
		let week = arrName.pop()
		const arrRaceName = temp.name.split("@")
		let racename = arrRaceName.pop()
		let weekslug = arrSlug.pop()
		racetemp.eventId = temp._id
		racetemp.organizId = temp.organizId
		racetemp.name = `${racename}_w${week}`
		racetemp.slug = `${temp.slug}_week${weekslug}`
		setRaceTemp(racetemp)


		console.log(racetemp)
	}
	const onFinish = (values) => {
		let race = raceTemp
		race.name = values.name
		race.slug = values.slug
		delete race.__typename
		delete race.checkpoints[0].__typename
		console.log('Success:', race);
		setLoading(true)
		raceCreateOne({
			variables: {
				record: {
				...race
				}
			}
		}).then(res => 
			Modal.success({
				title: 'Updated',
				onOk: () => {
					setLoading(false)
					history.replace(`/races`)
				}
			})
		).catch(err => {
			setLoading(false)
			console.log(err)
		})

  }
	

	return(
		<Layout>
			<Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
				<Select
					style={{width: '300px'}}
					placeholder="เลือก สนามวิ่ง"
					onSelect={(value, event) => handleSelect(value, event)}
				>
					{events && events.map((ev) => (
						<Select.Option value={ev._id}>{ev.name}</Select.Option>
					))}
				</Select>
				{raceTemp && raceTemp.name &&(
					<Form onFinish={onFinish}>
						<Form.Item
							label="name"
							name="name"
							rules={[{ required: true }]}
							initialValue={raceTemp.name}
						>
							<Input style={{width: '300px'}}/>
						</Form.Item>
						<Form.Item
							label="slug"
							name="slug"
							rules={[{ required: true }]}
							initialValue={raceTemp.slug}
						>
							<Input style={{width: '300px'}}/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" loading={loading}>
								Submit
							</Button>
						</Form.Item>
					</Form>
					// <div>
					// 	<Input style={{width: '300px'}} value={raceTemp.name} />
					// 	<Input style={{width: '300px'}} value={raceTemp.slug} />
					// 	<Button style={{width: '300px'}}>บันทึก</Button>
					// </div>
				)}
			</Layout.Content>
		</Layout>
	)
}

export default Create