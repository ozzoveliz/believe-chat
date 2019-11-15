import React, { Component } from 'react';
import { Avatar, TextField, List, ListItem, ListItemText, ListItemAvatar, Typography } from "@material-ui/core"
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
                width: '100%'
            },
            textField: {
                color: 'white',
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 200,
            },
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
                        color: '#ffffff',
                        wordBreak: "break-word" 
                    }}
                    primary={ message.user.displayName }
                    secondary={ <Typography style={{ color: '#ffffff'}}>{message.text}</Typography> }
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
                    <h1>Chat Room</h1>
                    <Button 
                        variant="contained" 
                        className={this.classes.button}
                        onClick={ this.logout }>
                        Logout
                    </Button>
                    <List className={this.classes.root}>{this.renderMessages()}</List>
                    <TextField
                        autoFocus={true}
                        multiline={true}
                        rowsMax={3}
                        placeholder="Type something.."
                        onChange={event => this.setState({ text: event.target.value })}
                        value={this.state.text}
                        onKeyPress={this.onSubmit}
                        InputProps={{
                            className: this.classes.textField
                        }} />
                    <span ref={el => (this.bottomSpan = el)} />
                </div>
            );
        } else {
            return <Redirect to="/" />
        }
    }
}

export default ChatRoom;
