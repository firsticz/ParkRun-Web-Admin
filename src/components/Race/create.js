import React, { Component, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Table, Icon, Tooltip, Input, Spin, Layout, Tag, Dropdown, Menu, Button, Modal, Row, Col, Select } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import moment from 'moment'
import 'moment/locale/th'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import eventQuery from '../../graphql/queries/getEventNotRun'
// import updateRaceStatus from '../../graphql/mutations/updateRaceStatus'
// import addRacesByAdmin from '../../graphql/mutations/addRacesByAdmin'
const Search = Input.Search
moment.locale('th')

const Create = (props) => {

	const event = useQuery(eventQuery, {
    fetchPolicy: 'network-only',
	})
	if(event.loading){
    return <Spin />
	}
	const events = event.data.eventNotRun

	return(
		<Layout>
			<Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
				<Select
					style={{width: '300px'}}
					placeholder="เลือก สนามวิ่ง"
				>
					{events && events.map((ev) => (
						<Select.Option  value={ev._id}>{ev.name}</Select.Option>
					))}
				</Select>
			</Layout.Content>
		</Layout>
	)
}

export default Create