import React, { Component, PureComponent } from 'react';
import { Upload, Icon, message, Form, Input, Button, Avatar as AvatarImage } from 'antd';

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

class Avatar extends React.Component {
  state = {
    loading: false,
  };

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
      }));
      this.props.onImageUpload(info.file.response)
    }

    if (info.file.status === 'error') {
      this.setState({ loading: false });
      this.props.onImageUpload(info.file.response)
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">人脸注册</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        data={this.props.form}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/person/new"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <AvatarImage shape="square" size={102} icon="user" src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>

    );
  }
}





const FormItem = Form.Item;



class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false
  };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onSubmit(values)
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }



  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

  
    return (

      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('id', {
            rules: [{ required: true, message: 'Please input your id!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="id" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your name!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="name" />
          )}
        </FormItem>
        <FormItem>
        
          <Button type="primary" htmlType="submit" className="login-form-button">
            下一步
          </Button>
         
        </FormItem>
      </Form>
    );
  }
}


class PersonNew extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      step: 0,
      result: {}
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onImageUpload = this.onImageUpload.bind(this)
    this.onReset = this.onReset.bind(this)
    
  }

  onSubmit(value) {
    this.setState(
      {
        form: value,
        step: 1
      }
    )
  }
  onImageUpload(result) {
    console.log(result)

      if (result.code == 0) {
        this.setState({
          step: 2,
          result: result
        })
      } else {
        message.error(result.message || '系统错误')
        this.setState({
          step: 0
        })
      }
  }
  onReset() {
    this.setState(
      {
        step: 0
      }
    )
  }
  render() {
    const WrappedRegistrationForm = Form.create()(RegistrationForm);
    let content = null
    if (this.state.step == 0) {
      content= (<div className="login-form-container"><WrappedRegistrationForm onSubmit={this.onSubmit} /></div>)
    } else if (this.state.step == 1) {
      content= (<div className="upload-img-container"><div className="upload-img-content"><Avatar form={this.state.form} onImageUpload={this.onImageUpload} /></div></div>)
    } else {
      if (this.state.step === 2) {
        content= (<span>恭喜完成注册人脸信息<a onClick={this.onReset}>继续注册</a></span>)
      } else {
        content= (
          <span>注册失败</span>
        )
      }
    }
    return content
  }
}



export default PersonNew