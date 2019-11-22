import React, { Component } from 'react';
import { Avatar, ListItem, ListItemAvatar, ListItemText, TextField } from "@material-ui/core";
//import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Messages from './Messages';
import Users from './Users';

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
            url: "", // for upload
            progress: 0
        };
        this.registerUser = this.registerUser.bind(this);
        this.logout = this.logout.bind(this);
    }
    
    componentDidMount = () => {
        this.unregisteredAuthObserver = firebase.auth().onAuthStateChanged(user => {
            this.registerUser(user);
        });
    }

    componentWillUnmount = () => {
        this.unregisteredAuthObserver();
    }

    registerUser = user => {
        var newUser = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            online: true
        }
        if ( user.emailVerified ) {
            firebase
            .database()
            .ref("users/" + user.uid)
            .set(newUser);   
        } else {
            this.logout();
        }
    }

    onSubmit = event => {
        if (event.charCode === 13 && this.state.text.trim() !== "") {
            this.writeMessageToDB(this.state.text)
            this.setState({ text: "" })
        }
    }

    writeMessageToDB = message => {
        console.log(this.state.image);
        const currentUser = firebase.auth().currentUser;
        firebase
            .database()
            .ref("messages/")
            .push({
                displayName: currentUser.displayName,
                email: currentUser.email,
                image: this.state.image,
                photoURL: currentUser.photoURL,
                text: message,
                userUID: currentUser.uid
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
                    image: message.image,
                    text: message.text,
                    userUID: message.userUID
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
                .then(image => {
                    this.setState({ image });
                    this.writeMessageToDB(this.state.text)
                    this.setState({ text: "" })
                });
            }
        );
    };

    renderMessages = () => {
        console.log(firebase.auth().currentUser.uid);
        var userData = this.getUser(firebase.auth().currentUser.uid);
        console.log(userData);
        return this.state.messages.map(message => (
            <ListItem key={ message.key }>
                <ListItemAvatar>
                    <Avatar alt={ userData.displayName } src={ userData.photoURL } />
                </ListItemAvatar>
                <ListItemText
                    style={{ 
                        wordBreak: "break-word" 
                    }}
                    primary={ userData.displayName }
                    secondary={ message.text }
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
        firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid)
            .update({
                online: false
            });
        firebase.auth().signOut();
    }

    render() {
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
                    alignItems="flex-start"
                    container
                    direction="row">
                    <Grid 
                        item 
                        xs={2}>
                        <Users />
                    </Grid>
                    <Grid 
                        item 
                        xs={10}>
                        <Messages />
                        <div>
                            <TextField
                                autoFocus={true}
                                multiline={true}
                                rowsMax={3}
                                placeholder="Type something.."
                                onChange={event => this.setState({ text: event.target.value })}
                                value={this.state.text}
                                onKeyPress={this.onSubmit} />
                            <progress value={this.state.progress} max="100" className="progress" />
                            <input type="file" onChange={this.handleChange} />
                            <Button
                                onClick={this.handleUpload}
                                variant="contained">
                                Upload
                            </Button>
                        </div>
                        <span ref={el => (this.bottomSpan = el)} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default ChatRoom;
