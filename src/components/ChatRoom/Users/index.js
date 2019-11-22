import React, { Component } from 'react';
import firebase from 'firebase';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
        this.getAvatar = this.getAvatar.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
    }

    componentDidMount = () => {
        this.getUsers();
    }

    getUsers = () => {
        var usersDB = firebase
            .database()
            .ref("users/");
        usersDB.on("value", snapshot => {
            let newUsers = [];
            snapshot.forEach(child => {
                var user = child.val();
                if ( user.online ) {
                    newUsers.push({ 
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        userUID: user.userUID,
                    });   
                }
            });
            this.setState({ 
                users: newUsers
            });
        });
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

    renderUsers = () => {
        let keyCounter = 0;
        const users = this.state.users.map(user => {
            keyCounter++;
            return (
                <ListItem 
                    key={ keyCounter }>
                    <ListItemAvatar>
                        { this.getAvatar(user.displayName, user.photoURL) }
                    </ListItemAvatar>
                    <ListItemText
                        primary={ user.displayName } />
                </ListItem>
            );
        });
        return users;
    }

    render() {
        return <List>{ this.renderUsers() }</List>;
    }
}

export default Users;