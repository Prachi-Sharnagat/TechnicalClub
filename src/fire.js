// Firebase initialization with safe fallbacks
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArJWKv4olaO6opFmnPreDI9T55Eaka3-M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "technicalclub-15171.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "technicalclub-15171",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "technicalclub-15171.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "693975745320",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:693975745320:web:759704f7f368a95e5f461d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZP1ZB6VWY8"
};

let app = null;
let db = null;

try {
  if (firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn("Firebase initialization skipped or failed:", err);
}

export { app, db };
