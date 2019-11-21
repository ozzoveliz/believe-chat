import React, { Component } from 'react';
import firebase from 'firebase';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.getMessages = this.getMessages.bind(this);
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
                    image: message.image,
                    text: message.text,
                    userUID: message.userUID
                });
            });
            this.setState({ 
                messages: newMessages
            });
        });
    }

    getUser = userId => {
        var userData = [];
        var userDB = firebase
            .database()
            .ref("users/" + userId);
        userDB.on("value", snapshot => {
            snapshot.forEach(child => {
                var user = child.val();
                userData.push({
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl
                });
            });
        });
        return userData;
    }

    renderMessages = () => {
        const messages = this.state.messages.map(message => {
            let user = this.getUser(message.userId);
            console.log(user);
            return (
                <ListItem 
                    key={ this.state.messages.length }>
                    <ListItemAvatar>
                        <Avatar 
                            alt={ user.displayName } 
                            src={ user.avatarUrl } />
                    </ListItemAvatar>
                    <ListItemText
                        primary={ user.displayName }
                        secondary={ message.text } />
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