const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.loremIpsum = functions.https.onRequest((request, response) => {
    let myQuery = request.query.kaka;
    response.send("Lorem ipsum dolor sit amet - " + myQuery);
});
exports.getMessages = functions.https.onRequest((request, response) => {
    var messages = admin
                        .database()
                        .ref('/messages')
                        .on('value', snapshot => {
                            response.json(snapshot);
                        })
                        .toJSON();
    console.log(messages);
    //response.json(messages);
});