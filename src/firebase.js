import firebase from "firebase";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB9k5uH4XkwawRRqY0ZxDgr0-beyeRbjKw",
    authDomain: "toclone-instagram-react.firebaseapp.com",
    projectId: "toclone-instagram-react",
    storageBucket: "toclone-instagram-react.firebasestorage.app",
    messagingSenderId: "674352057136",
    appId: "1:674352057136:web:2e5b2c77fe24b3cfd616f5",
    measurementId: "G-VSCZTEWWRQ"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};