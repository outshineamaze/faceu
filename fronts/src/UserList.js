import { List, Avatar, Button, Spin } from 'antd';
import React, { Component, PureComponent } from 'react';


const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
const mockdata = {"results":[{"gender":"female","name":{"title":"miss","first":"debbie","last":"douglas"},"email":"debbie.douglas@example.com","nat":"AU"},{"gender":"male","name":{"title":"monsieur","first":"steffen","last":"renard"},"email":"steffen.renard@example.com","nat":"CH"},{"gender":"female","name":{"title":"miss","first":"mathilde","last":"dumas"},"email":"mathilde.dumas@example.com","nat":"FR"},{"gender":"female","name":{"title":"ms","first":"farah","last":"kvale"},"email":"farah.kvale@example.com","nat":"NO"},{"gender":"male","name":{"title":"mr","first":"simon","last":"fortin"},"email":"simon.fortin@example.com","nat":"CA"}]}
class LoadMoreList extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
  }

  componentDidMount() {

    fetch("/person/getpersonids").then((response) => {
      return response.json()
    }).then((result) => {
      console.log(result)
      this.setState({
        loading: false,
        data: result.data,
      });
    })
  }


  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
  }

  render() {
    const { loading, loadingMore, showLoadingMore, data } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
      </div>
    ) : null;
    return (
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        //loadMore={loadMore}
        dataSource={data}
        renderItem={item => (
          <List.Item actions={[<a>添加人脸</a>, <a>删除</a>]}>
            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={<a >{item.person_id}</a>}
              description={item.person_name}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default LoadMoreList
