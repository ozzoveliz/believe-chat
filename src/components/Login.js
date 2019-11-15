import React, { Component } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.uiConfig = {
            signInFlow: "popup",
            signInSuccessUrl: "/chatroom",
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]
        }
    }
    
    render() {
        return (
            <div className="App">
                <StyledFirebaseAuth
                    uiConfig={this.uiConfig}
                    firebaseAuth={firebase.auth()} />
            </div>
        );
    }
}

export default Login;
