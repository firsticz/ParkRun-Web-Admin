import React, { useState } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Input, Spin, Layout, InputNumber, Table, Select, Space } from 'antd'
import moment from 'moment'
import 'moment/locale/th'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import AllRunnerQuery from '../../graphql/queries/getAllRunnerReport'
const { Option } = Select

const Runner = (props) => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 750)
	const [time, setTime] = useState(25)
	const [date, setDate ] = useState(moment().startOf('day').toDate())

	const { data, loading, refetch } = useQuery(AllRunnerQuery, {
		variables:{
			time,
			date: date
		},
    fetchPolicy: 'network-only',
	})
	
	if(loading){
    return <Spin />
	}

	const bibNumber = (number) => {
		const pad = '0000000'
		return pad.substr(0, pad.length - `${number}`.length) + number
	}

	const columns = [{
		title: 'เลขบิบ',
		dataIndex: 'bib',
		key: 'bib',
		render: (bib) => bibNumber(Number(bib))
	},{
		title: 'ชื่อ',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: 'เพศ',
		dataIndex: 'gender',
		key: 'gender',
		render: (gender) => gender === 'male'? 'ชาย': 'หญิง'
	},{
		title: 'อีเมล',
		dataIndex: 'email',
		key: 'email',
	},{
		title: 'เบอร์โทร',
		dataIndex: 'phone',
		key: 'phone',
	},{
		title: 'จำนวนครั้งในการวิ่ง',
		dataIndex: 'timeCount',
		key: 'timeCount',
	}]

	const startDate = moment('2020-12-05')
	const nowDate = moment()
	const count = (nowDate.diff(startDate, 'days')+1)/7
	let datelist = []
	datelist.push(moment(startDate).format('YYYY-MM-DD'))
	for(let i = 1; i < count; i++){
		
		const d = startDate.add(7, 'days').format('YYYY-MM-DD')
		datelist.push(d)
	}


	const handleSearchChange = (e) =>{
		setTime(e)
		// if(e){
		// 	refetch({
		// 		time: e,
		// 		date: date
		// 	})
		// }
	}
	const handleSelectChange = (e) =>{
		setDate(moment(e))
		// if(e){
		// 	refetch({
		// 		time,
		// 		date: moment(e).startOf('day').toDate()
		// 	})
		// }
	}
	const onSubmit = () => {
		if(time !== null && date !== null){
			refetch({
				time,
				date
			})
		}
	}

  return(
		<Layout>
			<Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
				<div>
				<Space>
					<p style={!isMobile ? { margin: '8px' } : null}>จำนวนครั้ง</p>
					<InputNumber
						disabled={loading}
						placeholder="จำนวนครั้ง"
						onChange={ e => handleSearchChange(e)}
						min={1}
						defaultValue={time}
						style={!isMobile ? { width: '200px', margin: '8px' } : null}
					/>
					<Select 
						defaultValue={datelist[datelist.length - 1]}
						style={!isMobile ? { width: '120px', margin: '8px' } : null}
						onChange={ e => handleSelectChange(e)}
						value={moment(date).format('YYYY-MM-DD')}
						>
						{
							datelist.map((e)=>(
								<Option value={e}>{e}</Option>
							))
						}
					</Select>
				</Space>
				
				{/* <Button onClick={onSubmit}>ค้นหา</Button> */}
        <Table
          style={{whiteSpace: 'nowrap', background: '#fff'}}
          scroll={{ x: true }}
          columns={columns}
          dataSource={data.getRunnerReport}
          loading={loading}
          locale={{emptyText: 'ไม่มีข้อมูล'}}
          rowKey={record => record._id}
          pagination={{
            defaultPageSize: 50
          }}
        />
				</div>
			</Layout.Content>
		</Layout>
	)
}

export default Runner