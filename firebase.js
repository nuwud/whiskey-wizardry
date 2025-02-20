// filepath: /src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "whiskey-wizardry.firebaseapp.com",
    projectId: "whiskey-wizardry",
    storageBucket: "whiskey-wizardry.appspot.com",
    messagingSenderId: "562241928558",
    appId: "1:562241928558:web:86c3d967e83e0b01b6d57f",
    measurementId: "G-0EVD5MWHCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };