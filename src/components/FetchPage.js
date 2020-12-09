import React from 'react'
import _get from 'lodash/get'
class FetchPage extends React.Component {
  render () {
    const link = _get(this.props, 'location.search').substr(6)
    if (link) {
      this.props.history.replace(link)
    } else {
      this.props.history.replace('/')
    }
    return `Fetching ${link} ...`
  }
}

export default FetchPage
