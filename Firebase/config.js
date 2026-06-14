import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDk-EJ4Slhe9lbByYoj0nRUXIODidMysYg",
  authDomain: "sengarcarrerinstitute.firebaseapp.com",
  projectId: "sengarcarrerinstitute",
  storageBucket: "sengarcarrerinstitute.firebasestorage.app",
  messagingSenderId: "26466556795",
  appId: "1:26466556795:web:54a484eb11311a9711fbde",
  measurementId: "G-1B8706WK8Q"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }



