import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { CONFIG } from "./config";

const firebaseConfig = {
    apiKey: CONFIG.firebase.apiKey,
    authDomain: CONFIG.firebase.authDomain,
    projectId: CONFIG.firebase.projectId,
    storageBucket: CONFIG.firebase.storageBucket,
    messagingSenderId: CONFIG.firebase.messagingSenderId,
    appId: CONFIG.firebase.appId,
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
