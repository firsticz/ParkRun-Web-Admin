import React, { useState,Component } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useParams, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { Table, Tooltip, Input, Spin, Avatar ,List ,Button} from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import _ from 'lodash'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import getUserByBib from '../../graphql/queries/getUserByBib'
import clientAuth from '../../utils/clientAuth'
import { Form } from '@ant-design/compatible'


const FindUser = (props) => {
  const history = useHistory()
  // const [searchKey, setSearchKey] = useState('')
  // const [search, setSearch] = useState(false)
  const { getFieldDecorator } = props.form
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  // const [searchModal, setSearchModal] = useState(false)

    // const { data, loading, history } = this.props
    const userrole = useQuery(getUserByBib, {
      // variables: {
      //   bib : searchKey
      // },
      fetchPolicy: 'cache-and-network',
    })
    const userLoading = _get(userrole, 'loading')
    // console.log(userLoading);
    let users = _get(userrole, 'data.userOne')
    // console.log(typeof users);
    // console.log(users);
    // const { isMobile } = this.state
    // const role = clientAuth.login().role
    // let users
    // let onRowClick
    // if (!userLoading && users) {
    //   users = _orderBy(users.filter(user => !user.legacy), ['_id'], ['desc'])
    //   users = users.filter(user => {
    //     const s = !![user.bib, user.name, user.email].find(
    //       k => {
    //         return k.toLowerCase().replace(/\s/g, '').search(searchKey) !== -1
    //       }
    //     )
    //     return s
    //   })
    // }
    const bibNumber = (number) => {
      const pad = '0000000'
      return pad.substr(0, pad.length - `${number}`.length) + number
    }
    // console.log(user.bib);
    // const columns = [
    //   {
    //     title: 'เลขบิบ',
    //     dataIndex: 'user',
    //     key: 'bib',
    //     render: (userss) => bibNumber(Number(userss.bib))
    //   },
    //   {
    //     title: 'รูป',
    //     dataIndex: 'user',
    //     key: 'user',
    //     render: (user) => <Avatar size={80} src={`${user.image}`} />
    //   },
    //   {
    //     title: 'ชื่อผู้สมัคร',
    //     dataIndex: 'user',
    //     key: 'user',
    //     width: '100%',
    //     render: (user) => user.name
    //   }, 
    //   // {
    //   //   title: 'เพศ',
    //   //   dataIndex: 'user',
    //   //   key: 'user.gender',
    //   //   render: (user) => user.gender === 'male'? 'ชาย': 'หญิง'
    //   // },{
    //   //   title: 'อีเมล',
    //   //   dataIndex: 'user',
    //   //   key: 'email',
    //   //   render: (user) => user.email
    //   // },
    //   {
    //     title: 'เบอร์โทร',
    //     dataIndex: 'user',
    //     key: 'phone',
    //     render: (user) => user.phone
    //   },
    //   // {
    //   //   title: 'เบอร์โทรฉุกเฉิน',
    //   //   dataIndex: 'user',
    //   //   key: 'emergenPhone',
    //   //   render: (user) => user.emergenPhone
    //   // },
    //   // {
    //   //   title: 'ประวัติการแพ้ยา',
    //   //   dataIndex: 'user',
    //   //   key: 'drug',
    //   //   render: (user) => user.drug
    //   // }
    // ]

    if(userLoading){
      return <Spin></Spin>
    }
    // console.log(_.users)
    // const userss = _.compact([user])
    // console.log(userss);

    const handleSearch = async(e) => {
      e.preventDefault()
      setLoading(true)
      props.form.validateFieldsAndScroll( async(err, record) => {
        if (err) {
          setLoading(false)
          return console.error(err)
        }
        const result = await userrole.refetch({bib: Number(record.bib)})
        // console.log(result);
        setUser(result.data.userOne)
        // console.log(user);
        setLoading(false)
      })
    }
    // const handleCancel = () => {
    //   setSearchModal(false)
    //   setUser({})
    // };
    return (
      <div>
        {/* <Search
          placeholder="ค้นหา"
          onChange={ e => setSearchKey( e.target.value)}
          // style={!isMobile ? { width: '388px', margin: '8px' } : null}
        /> */}
        <Form style={{ width: '200px', marginTop: '2em' }}  layout="inline">
          <Form.Item>
            {getFieldDecorator('bib', {
              rules: [{ required: true, message: 'Please input your bib!' }]
            })(
              <Input placeholder="bib" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={(e)=>handleSearch(e)}>
              ค้นหา
            </Button>
          </Form.Item>
        </Form>
        {user && user.name && <List>
          <List.Item actions={[<Link to={{
            pathname:`${/users/}${users._id}/edit`
          }}
          >
            แก้ไข
          </Link>, <a key="list-loadmore-more">ลบ</a>]}>
            <List.Item.Meta 
              avatar={
                <Avatar size={80} src={`${user.image}`} />
              }
              title={`ชื่อ ${user.name}`}
              description={`BIB: ${user.bib}, เบอร์โทร: ${user.phone}`}
            />
          </List.Item>
        </List>}
        {/* <Table
          onRow={(record, rowIndex) => {
            // console.log({record})
            return {
              onClick: user => {
                history.replace(`/users/${record._id}/edit`)
              } // click row
              // onDoubleClick: event => {}, // double click row
              // onContextMenu: event => {}, // right button click row
              // onMouseEnter: event => {}, // mouse enter row
              // onMouseLeave: event => {}, // mouse leave row
            }
          }}
          style={{whiteSpace: 'nowrap', background: '#fff'}}
          scroll={{ x: true }}
          // columns={columns}
          dataSource={_.users}
          loading={loading}
          // locale={{emptyText: 'ไม่มีข้อมูล'}}
          rowKey={record => record._id}
        /> */}
      </div>
    )
}

export default compose(
  Form.create()
)(FindUser)