import React, { Component, PureComponent } from 'react';
import { Upload, Icon, message, Form, Input, Tooltip, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Avatar as AvatarImage } from 'antd';
import {  Link } from 'react-router-dom'
import { withRouter } from 'react-router'
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
      message.loading('正在注册人脸信息');
      this.props.onImageUpload(info.file.response)
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传人脸信息</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/person/upload_img"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <AvatarImage shape="square" size={102} icon="user" src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>

    );
  }
}





const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;



class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
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

      // <Form onSubmit={this.handleSubmit}>
      //   <FormItem
      //     {...formItemLayout}
      //     label="ID"
      //   >
      //     {getFieldDecorator('id', {
      //       rules: [{
      //        required: true, message: 'Please input your E-mail!',
      //       }],
      //     })(
      //       <Input />
      //       )}
      //   </FormItem>

      //   <FormItem
      //     {...formItemLayout}
      //     label={(
      //       <span>
      //         Nickname&nbsp;
      //         <Tooltip title="What do you want others to call you?">
      //           <Icon type="question-circle-o" />
      //         </Tooltip>
      //       </span>
      //     )}
      //   >
      //     {getFieldDecorator('name', {
      //       rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
      //     })(
      //       <Input />
      //       )}
      //   </FormItem>
      //   <FormItem {...tailFormItemLayout}>
      //     <Button type="primary" htmlType="submit">下一步</Button>
      //   </FormItem>
      // </Form>
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

    fetch("/person/new", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.assign({}, this.state.form, {
        image_path: result.path
      }))
    }).then((response) => {
      return response.json()
    }).then((result) => {
      console.log(result)
      message.destroy()
      if (result.code == 0) {
        this.setState({
          step: 2,
          result: result
        })
      } else {
        message.error(result.message)
        this.setState({
          step: 0
        })
      }
      
    }).catch((error) => {
      message.error(error.message)
        this.setState({
          step: 0
        })
    })
  }
  render() {
    console.log(this.state)
    const WrappedRegistrationForm = Form.create()(RegistrationForm);
    let content = null
    if (this.state.step == 0) {
      content= (<div className="login-form-container"><WrappedRegistrationForm onSubmit={this.onSubmit} /></div>)
    } else if (this.state.step == 1) {
      content= (<div className="upload-img-container"><div className="upload-img-content"><Avatar onImageUpload={this.onImageUpload} /></div></div>)
    } else {
      if (this.state.step === 2) {
        content= (<span>恭喜完成注册人脸信息<Link to="/new">继续注册</Link></span>)
      } else {
        content= (
          <span>注册失败</span>
        )
      }
    }
    return content
  }
}



export default withRouter(PersonNew)