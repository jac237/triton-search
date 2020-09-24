import firebase from 'firebase';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

export default firebase;
