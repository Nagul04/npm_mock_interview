// Import the functions you need from the SDKs you need
import { initializeApp ,getApp,getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBMCBl7SPHcgqzHKtvcORsIwiR9NlqiM-Y",
    authDomain: "alan-17ec3.firebaseapp.com",
    projectId: "alan-17ec3",
    storageBucket: "alan-17ec3.firebasestorage.app",
    messagingSenderId: "447680807523",
    appId: "1:447680807523:web:2785e5e946d012c45f2e56",
    measurementId: "G-WGKF1TW0HZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);