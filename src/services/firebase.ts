import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCjrr7PseOZgerNqZdXQ-kbIMGdH1HoA04",
    authDomain: "pulse-manga-vault.firebaseapp.com",
    projectId: "pulse-manga-vault",
    storageBucket: "pulse-manga-vault.firebasestorage.app",
    messagingSenderId: "101746697024",
    appId: "1:101746697024:web:82bc621b8b4450166d90a5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
