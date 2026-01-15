// Firebase core setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDHPQIdtYdAQmGEZEfo4DJvIOVBA6G5go",
  authDomain: "foodops-platform.firebaseapp.com",
  projectId: "foodops-platform",
  storageBucket: "foodops-platform.firebasestorage.app",
  messagingSenderId: "680677573032",
  appId: "1:680677573032:web:e81a01313d33a5f5ce9d9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
