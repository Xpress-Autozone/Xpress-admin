// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyCPC5_ZQFhxfWDT3tksKQspi_TAFi5-pOo",
  authDomain: "xpress-app-21cec.firebaseapp.com",
  projectId: "xpress-app-21cec",
  storageBucket: "xpress-app-21cec.firebasestorage.app",
  messagingSenderId: "1002881310344",
  appId: "1:1002881310344:web:408b15e96b2856798e093d",
  measurementId: "G-NTEMBFSL73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app , auth , analytics};