import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import compose from 'lodash/flowRight'
import { Link } from 'react-router-dom'
import { Form } from '@ant-design/compatible'
import { message, Input, Button } from 'antd'
import '@ant-design/compatible/assets/index.css'; 
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import authUserMutation from './graphql/mutations/authUser.js'
// import jsonwebtoken from 'jsonwebtoken'

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.props.adminAuth({
          variables: values
        }).then(({ data: { adminAuth: { token } } }) => {
          console.log({ token })
          localStorage.setItem('token', token)
          this.props.history.push('/')
        }).catch(err => message.error(err.message))
      }
    })
  }
  // TODO: if login notify
  render () {
    const { getFieldDecorator } = this.props.form
    return (<Form onSubmit={this.handleSubmit} className="login-form" style={{ width: '200px', margin: 'auto', marginTop: '2em' }}>
      {/* <Form.Item>
        <img src={logo} style={{ margin: 'auto', display: 'block'}} alt="Thai.run" />
      </Form.Item> */}
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'Please input your email!' }]
        })(
          <Input prefix={<UserOutlined style={{ fontSize: 13 }} />} placeholder="email" />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }]
        })(
          <Input prefix={<LockOutlined style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%', marginBottom: '6px' }}>
          Log in
        </Button>
        {/* <Button style={{ width: '100%' }}>
          <Link to='/register'> Register </Link>
        </Button> */}
      </Form.Item>
    </Form>)
  }
}

export default compose(
  // withRouter,
  Form.create(),
  graphql(authUserMutation, { name: 'adminAuth' })
)(Login)
