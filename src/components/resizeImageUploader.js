import React from 'react'
import { Upload, Button } from 'antd'
import loadImage from 'blueimp-load-image'
import _get from 'lodash/get'
import firebase from 'firebase/app'
import 'firebase/storage'
import moment from 'moment'
import dataURLtoBlob from 'blueimp-canvas-to-blob'
import { reject } from 'bluebird'
const MAX_DIMENSION = 2400
// const MAX_THUMBNAIL_DIMENSION = 300

const resizeImg = async (file, { width, height }, quolity = 1) => {
  return new Promise((resolve, reject) => {
    loadImage(file, canvas => {
      if (canvas.type === 'error') {
        return Promise.reject(new Error('Incorrect Image'))
      }
      const dataUrl = canvas.toDataURL(file.type, 1)
      const blob = dataURLtoBlob(dataUrl)
      blob.name = file.name
      blob.lastModified = Date.now()
      resolve(blob)
    }, {
      maxWidth: width,
      maxHeight: height,
      contain: true,
      orientation: true,
      canvas: true
    })
  })
}

const firebaseUpload = async (file ) => {
  const storages = firebase.storage()
  const metadata = {
    contentType: 'image/jpeg',
  }
  const storageRef = await storages.ref()
  const imageName = `parkrun${moment()}` // a unique name for the image
  const imgFile = storageRef.child(`Event/${imageName}.png`)
  try {
    const image = await imgFile.put(file, metadata)
    // console.log(image);
    const url = await imgFile.getDownloadURL()
    return new Promise((resolve, reject) => {
      if(url){
        resolve(url)
      } else {
        reject(new Error('Something went wrong'))
      }
    })
  } catch (e) {
    new Error('Something went wrong')
  }
}

class ImageUploader extends React.Component {
  state = {
    loading: false
  }
  handleChange = ({ file, fileList, event }) => {
    // console.log('change', { file })
    this.setState({ loading: true })
    const { onChange } = this.props
    if (file.status === 'done') {
      // const { fileUrl } = file.response
      const fileUrl = _get(file, 'response.thumbnail')
      onChange(fileUrl)
      this.setState({ loading: false })
    }
  }
  beforeUpload = async file => {
    // console.log('bu', { file })
  }
  customRequest = async ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials
  }) => {
    // TODO: use axios
    const {dimension} = this.props
    const [originalFile, thumbnailFile] = await Promise.all([
      resizeImg(file, { width: MAX_DIMENSION, height: MAX_DIMENSION }),
      resizeImg(file, { width: dimension, height: dimension })
    ])
    try {
      const [thumbnail] = await Promise.all([
        //firebaseUpload(originalFile),
        firebaseUpload(thumbnailFile)
      ])

      onSuccess({
        thumbnail
      })
    } catch (e) {
      console.error(e)
    }
  }
  render () {
    const { value } = this.props
    const thumbnailUrl = _get(value, 'thumbnail') || value
    console.log(thumbnailUrl);
    return <Upload onChange={this.handleChange} beforeUpload={this.beforeUpload} customRequest={this.customRequest} showUploadList={false}>
      {value
        ? <img src={thumbnailUrl} alt="logo" style={{ width: 300 }} />
        : <Button loading={this.state.loading}>Upload</Button>
      }
    </Upload>
  }
}

export default ImageUploader
