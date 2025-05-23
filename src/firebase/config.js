// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhii09Px3AywWb-AWS3JG15CuJm8lSf8A",
  authDomain: "addressbookapp-f3b21.firebaseapp.com",
  projectId: "addressbookapp-f3b21",
  storageBucket: "addressbookapp-f3b21.firebasestorage.app",
  messagingSenderId: "552456918399",
  appId: "1:552456918399:web:3db84f2da7e556e141f64a",
  measurementId: "G-GYGBYPTXN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const db = getFirestore(app); 