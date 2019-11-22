import React, { Component } from 'react';
import firebase from 'firebase';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.getImage = this.getImage.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getAvatar = this.getAvatar.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
    }

    componentDidMount = () => {
        this.getMessages();
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
                    displayName: message.displayName,
                    email: message.email,
                    image: message.image,
                    photoURL: message.photoURL,
                    text: message.text,
                    userUID: message.userUID,
                });
            });
            this.setState({ 
                messages: newMessages
            });
        });
    }

    getUser = userUID => {
        var userData = {};
        var userDB = firebase
            .database()
            .ref("users/" + userUID);
        userDB.on("value", snapshot => {
            userData = snapshot.val();
        });
        return userData;
    }

    getAvatar = (displayName, photoURL) => {
        if ( photoURL ) {
            return (
                <Avatar 
                    alt={ displayName } 
                    src={ photoURL } />
            );
        } else {
            return (
                <Avatar>
                    <AccountCircleIcon />
                </Avatar>
            );
        }
    }

    renderMessages = () => {
        let keyCounter = 0;
        const messages = this.state.messages.map(message => {
            keyCounter++;
            return (
                <ListItem 
                    key={ keyCounter }>
                    <ListItemAvatar>
                        { this.getAvatar(message.displayName, message.photoURL) }
                    </ListItemAvatar>
                    <ListItemText
                        primary={ message.displayName }
                        secondary={ message.text } />
                    { 
                        message.image ?  
                            <img
                            src={message.image}
                            alt="Uploaded Images"
                            height="300"
                            width="400" /> :
                        <br />
                    }
                </ListItem>
            );
        });
        return messages;
    }

    render() {
        return <List>{ this.renderMessages() }</List>;
    }
}

export default Messages;