import React, { Component } from 'react';
import { AppBar, Avatar, List, ListItem, ListItemAvatar, ListItemText, TextField, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: true,
            text: "", 
            messages: []
        };
        this.classes = makeStyles(theme => ({
            button: {
                margin: theme.spacing(1),
            },
            inline: {
                display: 'inline',
            },
            root: {
                backgroundColor: theme.palette.background.paper,
                maxWidth: 360,
                width: '100%',
            },
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 200,
            },
            title: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            }
        }));
        this.logout = this.logout.bind(this);
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                isSignedIn: !!user
            });
            console.log(user.currentUser);
        });
        this.getMessages()
    }

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
                    text: message.text,
                    user: message.user
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

    renderMessages = () => {
        return this.state.messages.map(message => (
            <ListItem alignItems="flex-start" key={ message.id }>
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
            </ListItem>
        ))
    }
    
    logout() {
        firebase.auth().signOut();
    }

    render() {
        if ( this.state.isSignedIn ) {
            return (
                <div className="App">
                    <AppBar>
                        <Toolbar display="flex" justifyContent="space-between">
                            <Typography variant="h6" className={this.classes.title}>
                                Chat Room
                            </Typography>
                            <Button
                                variant="contained" 
                                className={this.classes.button}
                                onClick={ this.logout }>
                                Logout
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <List className={this.classes.root}>{this.renderMessages()}</List>
                    <TextField
                        autoFocus={true}
                        multiline={true}
                        rowsMax={3}
                        placeholder="Type something.."
                        onChange={event => this.setState({ text: event.target.value })}
                        value={this.state.text}
                        onKeyPress={this.onSubmit} />
                    <span ref={el => (this.bottomSpan = el)} />
                </div>
            );
        } else {
            return <Redirect to="/" />
        }
    }
}

export default ChatRoom;
