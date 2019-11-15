import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { init as firebaseInit } from './javascripts/firebase';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);
        firebaseInit();
    }

    render() {
        return (
            <Router>            
                <Switch>
                    <Route path="/" exact component={ Login } />
                    <Route path="/chatroom" component={ ChatRoom } />
                </Switch>
            </Router>
        );
    }
}

export default App;
