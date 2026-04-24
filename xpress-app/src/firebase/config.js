// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCPC5_ZQFhxfWDT3tksKQspi_TAFi5-pOo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "xpress-app-21cec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "xpress-app-21cec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "xpress-app-21cec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1002881310344",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1002881310344:web:408b15e96b2856798e093d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NTEMBFSL73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app , auth , analytics};