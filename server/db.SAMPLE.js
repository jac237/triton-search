/* eslint-disable */
const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

module.exports = db;