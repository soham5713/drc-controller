// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDbB_QnbGQBooX3aN6VywepbIa8mG6lGBE",
    authDomain: "drc-co.firebaseapp.com",
    databaseURL: "https://drc-co-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "drc-co",
    storageBucket: "drc-co.firebasestorage.app",
    messagingSenderId: "93870049511",
    appId: "1:93870049511:web:7350bcea584dea2eaaba42",
    measurementId: "G-GT032RF9DH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, updateDoc, getDoc };
