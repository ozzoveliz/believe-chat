import React, { Component } from 'react';
import firebase from 'firebase';
import config from './components/Firebase';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        firebase.initializeApp(config);
        this.state = {
            isSignedIn: Boolean(firebase.auth().currentUser) ? false : true
        }
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            this.setState({
                isSignedIn: Boolean(user) ? true : false
            });
        });
    }
      
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        console.log("isSignedIn: " + this.state.isSignedIn);
        return (
            <React.Fragment>
                <CssBaseline />
                <Router>            
                    <Switch>
                        <Route path="/" exact render={() => {
                            if ( this.state.isSignedIn ) {
                                return <ChatRoom />;
                            } else {
                                return <Redirect to="/login" />
                            }
                        }} />
                        <Route path="/login" component={ Login } />
                    </Switch>
                </Router>
            </React.Fragment>
        );
    }
}

export default App;
