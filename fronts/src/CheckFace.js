import React, { Component, PureComponent } from 'react';
import { Upload, Icon, message, Card, Avatar } from 'antd';


const { Meta } = Card;


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('Image must smaller than 5MB!');
  }
  return isLt2M;
}

class CheckFace extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        loading: false,
        result: {}
      };
      this.onReset = this.onReset.bind(this)
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
        result: info.file.response
      }));
      
    }
    if (info.file.status === 'error') {
        this.setState({ loading: false, result: {} });
        return;
      }
    
  }

  onReset() {
    this.setState(
      {
        result: {}
      }
    )
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">人脸识别</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const result = this.state.result
    if (result && result.data) {
        if (result.data.group_size > 0 && result.data.candidates) {
            const mostCandidateOne = result.data.candidates[0]
            return (
                <div>
        <div  style={{ width: '100%', marginLeft: '50%' }}>
                <Card
                style={{ width: 300,marginLeft: -150 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={mostCandidateOne.person_id}
                  description={`匹配程度: ${mostCandidateOne.confidence}%`}
                />
              </Card>
             
              </div>
              <a onClick={this.onReset}>返回</a>
              </div>
            )
        } else {
            return (<span>未匹配到注册的人脸信息</span>)
        }
        
    } else {
        return (
            <div className="upload-img-container">
            <div className="upload-img-content">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/person/search"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <Avatar shape="square" size={102} icon="user" src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
            </div>
            </div>
          );
    }


    
  }
}

export default CheckFace
