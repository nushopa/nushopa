import { initializeApp, getApps, getApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0PjctaYaZhaN0iTx0CYa3XjqKpmE5HHk",
  authDomain: "nushopa-3e02e.firebaseapp.com",
  projectId: "nushopa-3e02e",
  storageBucket: "nushopa-3e02e.firebasestorage.app",
  messagingSenderId: "53761534400",
  appId: "1:53761534400:web:eb3dd83b6adda245ed4025",
  measurementId: "G-F38996XSHB",
};

// Reuse the existing app if one is already initialized (avoids duplicate-app errors
// during hot reload or in Next.js)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("profile");

export { auth, provider, signInWithPopup };
