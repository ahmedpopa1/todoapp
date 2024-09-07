import { auth } from "./Config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Listener for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("We are authenticated now!", user);
  } else {
    console.log("No user is authenticated.");
  }
});

// Registration function
async function register(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Registration successful:", cred.user);
    return cred;
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
}

// Login function
async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful");
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

// Logout function
async function logout() {
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
}

export { register, login, logout };
