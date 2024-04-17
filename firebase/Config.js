// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, setDoc, updateDoc, serverTimestamp, query, onSnapshot, doc, where, runTransaction, getDoc,getDocs } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3PfQrx8Rp3cvAFg_clwE3HNwAKIZsB1Q",
    authDomain: "smartsaver-6b7d4.firebaseapp.com",
    projectId: "smartsaver-6b7d4",
    storageBucket: "smartsaver-6b7d4.appspot.com",
    messagingSenderId: "1055547833369",
    appId: "1:1055547833369:web:0224daf600520d45c67e88"
};

// Initialize Firebase App
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // get the already initialized app
}

// Get a Firestore instance
const firestore = getFirestore(app);

// Initialize Auth with AsyncStorage for persistence
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (error) {
    if (error.code === 'auth/already-initialized') {
        auth = getAuth(app); // get the already initialized auth instance
    } else {
        console.error("Error initializing Firebase Auth:", error);
    }
}

export {
  app,
  firestore,
  addDoc,
  serverTimestamp,
  query,
  collection,
  onSnapshot,
  doc,
  auth,
  firestore as db,  // Alias for consistency
  where,
  setDoc,
  runTransaction,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
};
