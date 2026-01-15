// Firebase Authentication integration
import app from "./firebase.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Initialize Auth
const auth = getAuth(app);

// Sign up new user
export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login existing user
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export function logout() {
  return signOut(auth);
}
