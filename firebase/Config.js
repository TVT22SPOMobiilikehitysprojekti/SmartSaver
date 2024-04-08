// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3PfQrx8Rp3cvAFg_clwE3HNwAKIZsB1Q",
    authDomain: "smartsaver-6b7d4.firebaseapp.com",
    projectId: "smartsaver-6b7d4",
    storageBucket: "smartsaver-6b7d4.appspot.com",
    messagingSenderId: "1055547833369",
    appId: "1:1055547833369:web:0224daf600520d45c67e88"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore();

export{
    firestore,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
};