import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // Config provided by 'firebase apps:sdkconfig'
    // Only public identifiers here
    projectId: "gen-lang-client-0578854454",
    appId: "1:826377210351:web:7fc448ed9f14a0f7d9ce1a",
    storageBucket: "gen-lang-client-0578854454.firebasestorage.app",
    // apiKey, authDomain strictly needed only if using Auth/Client-side DB access directly
    // For this MV, we are relying on Server Side Admin SDK predominantly.
    // Add apiKey if client-side access is needed.
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
