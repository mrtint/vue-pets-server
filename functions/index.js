const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const collection = db.collection('vuepets');

// Automatically allow cross-origin requests
app.use(cors({
    origin: true
}));

// pet list
app.get('/', (request, response) => {
    collection.get().then(snapshot => {
        var result = new Array();
        snapshot.forEach(doc => {
            var data = doc.data();
            data.id = doc.id;
            result.push(data);
        });
        console.log(result);
        response.send(result);
    }).catch(err => {
        console.log(err);
        response.status(500).send(err);
    });
});

// add pet
app.put('/', (request, response) => {
    var data = {
        userName: request.body.userName,
        petName: request.body.petName,
        userId: request.body.userId,
        desc: request.body.desc,
        image: request.body.image,
        createDate: new Date()
    };

    collection.add(data).then(doc => {
        console.log(doc.id);
        response.send(doc);
    }).catch(err => {
        console.log(err);
        response.status(500).send(err);
    });
});

// Expose Express API as a single Cloud Function:
exports.vuepets = functions.https.onRequest(app);