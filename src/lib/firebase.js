// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhvwAU7wl6-l3txwXVNOIgNLbYW87AdDs",
  authDomain: "nushopa-web.firebaseapp.com",
  projectId: "nushopa-web",
  storageBucket: "nushopa-web.firebasestorage.app",
  messagingSenderId: "997814702955",
  appId: "1:997814702955:web:25321038d3bd512350322e",
  measurementId: "G-4MPFSTHXR3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// From Firebase Console > Project Settings > Cloud Messaging >
// Web configuration > Web Push certificates. Not secret (same reasoning as
// apiKey above) — safe to hardcode alongside the rest of this config.
export const VAPID_KEY = "REPLACE_WITH_YOUR_WEB_PUSH_CERTIFICATE_KEY";

// Messaging (push notifications). Guarded because getMessaging() throws in
// contexts that don't support it (some in-app browsers, certain Safari
// setups) — unlike getAnalytics() above, which doesn't need the guard.
let messagingPromise = null;
export function getMessagingIfSupported() {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) =>
      supported ? getMessaging(app) : null
    );
  }
  return messagingPromise;
}