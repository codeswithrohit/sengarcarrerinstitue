import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAmh-vSdWHeN0m7XQCmkEbcaadvVUhEOYs",
  authDomain: "itechrakshak.firebaseapp.com",
  projectId: "itechrakshak",
  storageBucket: "itechrakshak.firebasestorage.app",
  messagingSenderId: "824187330364",
  appId: "1:824187330364:web:58e275ec737aa021b04839",
  measurementId: "G-6VCNM1R64K"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }



