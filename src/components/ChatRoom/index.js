import React, { Component } from 'react';
import { Avatar, ListItem, ListItemAvatar, ListItemText, TextField } from "@material-ui/core";
//import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Messages from '../Messages';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: "", // for chat
            image: null, // for upload
            url: "" // for upload
        };
        this.logout = this.logout.bind(this);
    }
    
    /*componentDidMount = () => {
        const self = this;
        this.unregisteredAuthObserver = firebase.auth().onAuthStateChanged(user => {
            console.log(user);
            self.setState({
                isSignedIn: Boolean(user)
            });

        });
    }

    componentWillUnmount = () => {
        this.unregisteredAuthObserver();
    }*/

    onSubmit = event => {
        if (event.charCode === 13 && this.state.text.trim() !== "") {
          this.writeMessageToDB(this.state.text)
          this.setState({ text: "" })
        }
    }

    writeMessageToDB = message => {
        firebase
            .database()
            .ref("messages/")
            .push({
                id: this.state.messages.length,
                text: message,
                image: this.state.image,
                user: {
                    displayName: firebase.auth().currentUser.displayName,
                    photoURL: firebase.auth().currentUser.photoURL,
                    email: firebase.auth().currentUser.email
                }
            });
    }

    getMessages = () => {
        var messagesDB = firebase
            .database()
            .ref("messages/")
            .limitToLast(500);
        messagesDB.on("value", snapshot => {
            let newMessages = [];
            snapshot.forEach(child => {
                var message = child.val();
                newMessages.push({ 
                    id: message.id, 
                    image: message.image,
                    text: message.text,
                    userId: message.userId
                });
            });
            this.setState({ 
                messages: newMessages
            });
            this.bottomSpan.scrollIntoView({ 
                behavior: "smooth" 
            });
        });
    }

    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    };

    handleUpload = () => {
        const { image } = this.state;
        const storage = firebase.storage();
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function ...
                const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({ progress });
            },
            error => {
                // Error function ...
                console.log(error);
            },
            () => {
                // complete function ...
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    this.setState({ url });
                });
                this.writeMessageToDB(this.state.text)
                this.setState({ text: "" })
            }
        );
    };

    renderMessages = () => {
        return this.state.messages.map(message => (
            <ListItem key={ message.id }>
                <ListItemAvatar>
                    <Avatar alt={ message.user.displayName } src={ message.user.photoURL } />
                </ListItemAvatar>
                <ListItemText
                    style={{ 
                        wordBreak: "break-word" 
                    }}
                    primary={ message.user.displayName }
                    secondary={message.text}
                />
                {this.getMessageImage(message.image)}
            </ListItem>
        ))
    }

    getMessageImage(image) {
        if (image) {
            return (
                <img
                    src={image}
                    alt="Uploaded Images"
                    height="300"
                    width="400" />
            );
        }
        return false;
    }
    
    logout = () => {
        firebase.auth().signOut();
    }

    render() {
        //console.log(this.state.isSignedIn);
        //if ( this.state.isSignedIn ) {
            return (
                <div className="Login">
                    <AppBar position="static">
                        <Toolbar>
                            <Typography 
                                className="title" 
                                variant="h6">
                                Chat Room
                            </Typography>
                            <Button 
                                onClick={this.logout} 
                                variant="contained">
                                Logout
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Grid
                        alignItems="start"
                        container
                        direction="row"
                        justify="center">
                        <Grid 
                            item 
                            xs={2}>
                            User List
                        </Grid>
                        <Grid 
                            item 
                            xs={10}>
                            ChatRoom
                        </Grid>
                    </Grid>
                </div>
            );
        /*} else {
            return <Redirect to="/login" />
        }*/
    }
}

export default ChatRoom;
