// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  setAnalyticsCollectionEnabled,
} from "firebase/analytics";
import {
  getMessaging,
  isSupported as isMessagingSupported,
} from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0PjctaYaZhaN0iTx0CYa3XjqKpmE5HHk",
  authDomain: "nushopa-3e02e.firebaseapp.com",
  projectId: "nushopa-3e02e",
  storageBucket: "nushopa-3e02e.firebasestorage.app",
  messagingSenderId: "53761534400",
  appId: "1:53761534400:web:eb3dd83b6adda245ed4025",
  measurementId: "G-F38996XSHB",
};

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analyticsClient;
export async function setAnalyticsConsent(enabled) {
  if (!enabled) {
    if (analyticsClient) {
      await setAnalyticsCollectionEnabled(analyticsClient, false);
    }
    return;
  }
  if (!(await isAnalyticsSupported())) return;
  analyticsClient = analyticsClient || getAnalytics(app);
  await setAnalyticsCollectionEnabled(analyticsClient, true);
}

// From Firebase Console > Project Settings > Cloud Messaging >
// Web configuration > Web Push certificates. Not secret (same reasoning as
// apiKey above) — safe to hardcode alongside the rest of this config.
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

// Messaging (push notifications). Guarded because getMessaging() throws in
// contexts that don't support it (some in-app browsers, certain Safari
// setups) — unlike getAnalytics() above, which doesn't need the guard.
let messagingPromise = null;
export function getMessagingIfSupported() {
  if (!messagingPromise) {
    messagingPromise = isMessagingSupported().then((supported) =>
      supported ? getMessaging(app) : null,
    );
  }
  return messagingPromise;
}
