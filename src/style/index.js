import styled from 'styled-components'
import { Layout } from 'antd'

const { Content } = Layout
export const AppWrapper = styled.div`
  .ant-layout-header {
    padding: 0 13px;
  }
  .code-box {
    border: 1px solid #ebedf0;
    border-radius: 2px;
    display: inline-block;
    width: 100%;
    position: relative;
    margin: 0 0 16px;
    -webkit-transition: all .2s;
    transition: all .2s;
  }
  div.listContent {
    background: white;
    margin: 2px;
  }
  
  div.editContent {
    div.modDeleteButton {
      text-align: right;
      height: 0;
      position: relative;
      right: 10px;
      top: 3px;
    }
  }

  h2.title {
    color: #0d1a26;
    font-weight: 500;
    margin-bottom: 20px;
    margin-top: 8px;
    font-family: Lato,Monospaced Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    font-size: 30px;
    line-height: 38px;
  }
`

export const Logo = styled.div`
  float: left;
  img {
    width: 40px;
    height: 60px;
  }
`