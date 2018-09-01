import React, { Component, PureComponent } from 'react';
import { Menu, Icon } from 'antd';

import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
class MenuComponent extends Component {
  constructor(props) {
    super(props)
    const history = this.props.history
    console.log(history)
    this.state = {
      current: history.location.pathname.replace('/', '')
    }
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="new">
          <Link to="/new"><Icon type="team" />新增人脸</Link>
        </Menu.Item>
        <Menu.Item key="list">
          <Link to="/list"><Icon type="table" />人脸列表</Link>
        </Menu.Item>
        <Menu.Item key="check">
          <Link to="/check"><Icon type="smile-o" />搜索人脸</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(MenuComponent)