import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ApolloClient } from 'apollo-client'
import { ApolloLink, from } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-mobx'
import { ApolloProvider } from 'react-apollo'
import firebase from 'firebase'
import firebaseConfig from './firebaseConfig'
import createHistory from 'history/createBrowserHistory'


import routerStore from './stores/router'
import clientAuth from './utils/clientAuth'

import App from './App'
import Login from './Login'
import 'antd/dist/antd.css'

firebase.initializeApp(firebaseConfig)

const history = createHistory()

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
  // credentials: 'omit'
})
const errorLink = onError(({ networkError = {}, graphQLErrors }) => {
  if (networkError.statusCode === 401) {
    // userStore.logout()
    clientAuth.logout()
    // history.push('/login')
    // routerStore.push('/login')
  }
})

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache()
});

const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => {
    const { id, name, role } = clientAuth.login()
    return id
      ? React.createElement(component, Object.assign({}, props, { id, name, role }))
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  }} />
)

const stores = {
  router: routerStore
}

ReactDOM.render(
    <ApolloProvider client={client} >
      <Provider {...stores}>
        <Router routerStore={routerStore} component={BrowserRouter}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/token" render={({location})=>{
              const queryString = location.search;

              const urlParams = new URLSearchParams(queryString);
              
              const token = urlParams.get('token')
              localStorage.setItem('token', `${token}`)
              return <Redirect to={{ pathname: '/' }} />
            }} />
            <PrivateRoute path="/" component={App} />
          </Switch>
        </Router>
      </Provider>
    </ApolloProvider>,
  document.getElementById('root')
)

export default client

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
