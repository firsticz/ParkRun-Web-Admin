import React, { Component, useState } from 'react'
import {
  Link
} from 'react-router-dom'

import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Input, Spin, Layout, List, Row, Col, Button } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import moment from 'moment'
import 'moment/locale/th'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import EventAgeQuery from '../../graphql/queries/exportEventAge'
import ReactExport from 'react-data-export'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn
const Search = Input.Search
moment.locale('th')

const ReportList = () => {

	const eventAge = useQuery(EventAgeQuery, {
    fetchPolicy: 'network-only',
	})
	
	if(eventAge.loading){
    return <Spin />
	}
	const time = moment().format('YYYY-MM-DD')
	
	return (
		<Layout>
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
				<Row gutter={[8, 8]} justify='start'>
					<Col xs={24} md={6}>
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
				
			</Layout.Content>
		</Layout>
	)
}
export default ReportList