import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAhvwAU7wl6-l3txwXVNOIgNLbYW87AdDs",
  authDomain: "nushopa-web.firebaseapp.com",
  projectId: "nushopa-web",
  storageBucket: "nushopa-web.firebasestorage.app",
  messagingSenderId: "997814702955",
  appId: "1:997814702955:web:5c94f03ef95f980d50322e",
  measurementId: "G-7WBX10W7NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);