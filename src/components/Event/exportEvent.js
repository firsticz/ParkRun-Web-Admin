import React, { useState } from 'react'
import { Input, Spin, Layout, List, Row, Col, Button, Divider, InputNumber, Modal } from 'antd'
import _get from 'lodash/get'
import { useQuery, useMutation } from '@apollo/react-hooks'
import EventSider from './eventSider'
import eventQuery from '../../graphql/queries/eventOne'
import exportRunnerOrganizeMutation from '../../graphql/mutations/exportRunnerOrganize'

const ExportEvent = (props) => {
	const { match } = props
  const { eventId } = match.params
	const [loading, setLoading] = useState(false)

  const eventProps = useQuery(eventQuery, {
    variables: {
      _id: eventId
    },
    fetchPolicy: 'network-only'
  })
  const eventLoading = _get(eventProps, 'loading')
  const event = _get(eventProps, 'data.eventOne')

	const [exportAllRuunerByOrganize] = useMutation(exportRunnerOrganizeMutation)

	const onRunnerExportSubmit = (e) => {
		e.preventDefault()
		setLoading(true)
		if(eventId) {
			exportAllRuunerByOrganize({
				variables: {
					eventId
				}
			}).then(async (res) => {
				console.log(res);
				Modal.success({
					title: 'Download',
					content: (
						<div>
							<a href={`${res.data.exportAllRuunerByOrganize.url}`} download>{res.data.exportAllRuunerByOrganize.fileName}</a>
						</div>
					),
					onOk: () => {
						setLoading(false)
						props.history.push(`/fetchPage?link=/events/${eventId}/export`)
					}
				})
			})
		}
		else{
			setLoading(false)
		}
	}

  if (eventLoading) {
    return <div>...loading</div>
  } 
  if(!event){
    return 'event not found'
  }


	return(
		<Layout>
			{event && <EventSider />}
			<Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
				<Divider>Runner</Divider>
				<Row gutter={[8, 8]} justify='start'>
					<Col xs={24} md={12}>
						<List bordered={true}>
							<List.Item key='eventage'>
								<List.Item.Meta
									title='นักวิ่ง'
								/>
									<Button loading={loading} onClick={onRunnerExportSubmit}>Download</Button>
							</List.Item>
							
						</List>
					</Col>
				</Row>
				
			</Layout.Content>
		</Layout>
	)

}

export default ExportEvent