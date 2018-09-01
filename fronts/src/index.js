import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './App.css';
import PersonNew from './PersonNew'
import Menu from './Menu'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import UserList from './UserList'
import CheckFace from './CheckFace'

const defaultPage = () => {
  return (<a>welcome to face auth demo</a>)
}


class App extends Component {
  render() {
    return (
      <Router>

        <div className="App">
          <div className="App-header">
            <Menu />
          </div>
          <div className="App-Content">
            <Route path="/new" component={PersonNew} />
            <Route path="/list" component={UserList} />
            <Route path="/check" component={CheckFace} />
          </div>
        </div>
      </Router>

    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
