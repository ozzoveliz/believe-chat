import React, { Component } from 'react';
import firebase from 'firebase';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.uiConfig = {
            signInFlow: "popup",
            signInOptions: [
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
            signInSuccessUrl: '/',
        }
    }
    
    render() {
        return (
            <Container fixed>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Grid 
                        item 
                        xs={12}>
                        <Typography 
                            align="center" 
                            color="primary" 
                            variant="h2">
                            Believe Chat
                        </Typography>
                        <Typography 
                            align="center" 
                            gutterBottom>
                            Please sign in to continue
                        </Typography>
                        <StyledFirebaseAuth 
                            firebaseAuth={firebase.auth()} 
                            uiConfig={this.uiConfig} />
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default Login;
