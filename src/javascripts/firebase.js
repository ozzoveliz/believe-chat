import firebase from 'firebase';

export const init = () => {
    let config = {
        apiKey: "AIzaSyB2SYPdbkG15hryHSRAjkgo0YWRomsL0eg",
        authDomain: "believe-chat-22297.firebaseapp.com",
        databaseURL: "https://believe-chat-22297.firebaseio.com",
        projectId: "believe-chat-22297",
        storageBucket: "believe-chat-22297.appspot.com",
        messagingSenderId: "77729611353",
        appId: "1:77729611353:web:534775865b42fbb5087b48"
    }
    firebase.initializeApp(config)
}