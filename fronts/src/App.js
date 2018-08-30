import React, { Component, PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';

import Avatar from './PersonNew'

import { BrowserRouter as Router, Route } from 'react-router-dom'

class PersonNewComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      newPersonUrl: ''
    }
  }
  onChange(targets) {
    const file = targets.currentTarget.files[0]
    const url =  window.URL.createObjectURL(file)
    this.setState({
      newPersonUrl: url
    })
    fetch('/person/new').then((response) => {
      return response.text()
      
    }).then(res => {
      console.log(res)
    })
  }
  render() {
    return (
      <p className="App-intro">
        
        <input type="file" accept="image/*" capture="camera" onChange={this.onChange} />
        {this.state.newPersonUrl ? <img src={this.state.newPersonUrl} className="upload-img-container" /> : null}
      </p>
    )
  }
}
  

const defaultPage = () => {
  return (<a>hellow</a>)
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Router>
          <div>
            <Route path="/new" component={PersonNewComponent} />
            <Route path="/addface" component={Avatar} />
            <Route path="/list" component={defaultPage} />
            <Route path="/check" component={defaultPage} />
            
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
