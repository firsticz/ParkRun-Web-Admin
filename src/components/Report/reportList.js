import React, { useState } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { Input, Spin, Layout, List, Row, Col, Button, Divider, InputNumber, Modal } from 'antd'
import moment from 'moment'
import 'moment/locale/th'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import EventAgeQuery from '../../graphql/queries/exportEventAge'
import ReactExport from 'react-data-export'
import RunnerExportTimeMutation from '../../graphql/mutations/exportRunnerTime'
import VolunteerExportTimeMutation from '../../graphql/mutations/exportVolunteerTime'
import AllRunnerExportMutation from '../../graphql/mutations/exportAllRunner'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn
const Search = Input.Search
moment.locale('th')

const ReportList = (props) => {
	const [runnerTime, setRunnerTime] = useState(1)
	const [volunteerTime, setVolunteerTime] = useState(1)
	const [loading, setLoading] = useState(false)

	const [exportRunner] = useMutation(RunnerExportTimeMutation)
	const [exportVolunteer] = useMutation(VolunteerExportTimeMutation)
	const [exportAllRunner] = useMutation(AllRunnerExportMutation)

	const eventAge = useQuery(EventAgeQuery, {
    fetchPolicy: 'network-only',
	})
	
	if(eventAge.loading){
    return <Spin />
	}
	const time = moment().format('YYYY-MM-DD')

	const onRunnerChange = (e) => {
		setRunnerTime(e)
	}
	const onVolunteerChange = (e) => {
		setVolunteerTime(e)
	}

	const onRunnerExportSubmit = (e) => {
		e.preventDefault()
		console.log(runnerTime);
		setLoading(true)
		if(runnerTime >= 1) {
			exportRunner({
				variables: {
					time: runnerTime
				}
			}).then(async (res) => {
				console.log(res);
				Modal.success({
					title: 'Download',
					content: (
						<div>
							<a href={`${res.data.exportRunner.url}`} download>{res.data.exportRunner.fileName}</a>
						</div>
					),
					onOk: () => {
						setLoading(false)
						props.history.push(`/fetchPage?link=/report`)
					}
				})
			})
		}
		else{
			setLoading(false)
		}
	}

	const onVolunteerExportSubmit = (e) => {
		e.preventDefault()
		setLoading(true)
		if(volunteerTime >= 1) {
			exportVolunteer({
				variables: {
					time: volunteerTime
				}
			}).then(async (res) => {
				console.log(res);
				Modal.success({
					title: 'Download',
					content: (
						<div>
							<a href={`${res.data.exportVolunteer.url}`} download>{res.data.exportVolunteer.fileName}</a>
						</div>
					),
					onOk: () => {
						setLoading(false)
						props.history.push(`/fetchPage?link=/report`)
					}
				})
			})
		}
		else{
			setLoading(false)
		}
	}

	const onAllRunnerExportSubmit = (e) => {
		e.preventDefault()
		setLoading(true)
		exportAllRunner({
			variables: {
				time: volunteerTime
			}
		}).then(async (res) => {
			console.log(res);
			Modal.success({
				title: 'Download',
				content: (
					<div>
						<a href={`${res.data.exportAllRuuner.url}`} download>{res.data.exportAllRuuner.fileName}</a>
					</div>
				),
				onOk: () => {
					setLoading(false)
					props.history.push(`/fetchPage?link=/report`)
				}
			})
		})
		
	}
	

	return (
		<Layout>
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
	  		<Divider>All</Divider>
				<Row gutter={[8, 8]} justify='start'>
					<Col xs={24} md={12}>
						<List bordered={true}>
							<List.Item key='eventage'>
								<List.Item.Meta
									title='จำนวนนักวิ่งตามช่วงอายุ'
								/>
								<ExcelFile
									element={<Button>Download</Button>}
									filename={`EventAge${time}`}
								>
									<ExcelSheet data={eventAge.data.exportEventAge} name="Event">
											<ExcelColumn label="Name" value="name"/>
											<ExcelColumn label="Unknown" value="Unknown"/>
											<ExcelColumn label="Under19" value="Under19"/>
											<ExcelColumn label="age20_29" value="age20_29"/>
											<ExcelColumn label="age30_39" value="age30_39"/>
											<ExcelColumn label="age40_49" value="age40_49"/>
											<ExcelColumn label="age50_59" value="age50_59"/>
											<ExcelColumn label="age60_69" value="age60_69"/>
											<ExcelColumn label="age70_79" value="age70_79"/>
											<ExcelColumn label="Over80" value="Over80"/>
									</ExcelSheet>
            		</ExcelFile>
							</List.Item>
							
						</List>
					</Col>
				</Row>
				<Row gutter={[8, 8]} justify='start'>
				<Col xs={24} md={12}>
						<List bordered={true}>
							<List.Item key='eventage'>
								<List.Item.Meta
									title='AllRunner'
								/>
									<Button loading={loading} onClick={onAllRunnerExportSubmit}>Download</Button>
							</List.Item>
							
						</List>
					</Col>
				</Row>
				<Divider>Runner</Divider>
				<Row gutter={[8, 8]} justify='start'>
				<Col xs={24} md={12}>
						<List bordered={true}>
							<List.Item key='eventage'>
								<List.Item.Meta
									title='จำนวนครั้งในการวิ่ง ตามจำนวนที่กำหนด'
								/>
									<InputNumber  min={1} defaultValue={1} onChange={e => onRunnerChange(e)}  />
									<Button loading={loading} onClick={onRunnerExportSubmit}>Download</Button>
							</List.Item>
							
						</List>
					</Col>
				</Row>
				<Divider>Volunteer</Divider>
				<Row gutter={[8, 8]} justify='start'>
				<Col xs={24} md={12}>
						<List bordered={true}>
							<List.Item key='eventage'>
								<List.Item.Meta
									title='จำนวนครั้งในการเป็นอาสาสมัคร ตามจำนวนที่กำหนด'
								/>
									<InputNumber  min={1} defaultValue={1} onChange={e => onVolunteerChange(e)} />
									<Button loading={loading} onClick={onVolunteerExportSubmit}>Download</Button>
							</List.Item>
							
						</List>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	)
}
export default ReportList