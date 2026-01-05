import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For a real app, these would be in environment variables
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "aadhaar-vc-entry.firebaseapp.com",
  projectId: "aadhaar-vc-entry",
  storageBucket: "aadhaar-vc-entry.appspot.com",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
