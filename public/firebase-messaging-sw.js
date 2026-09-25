
/* eslint-disable no-undef */
/* global importScripts,  firebase */

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAhvwAU7wl6-l3txwXVNOIgNLbYW87AdDs",
  authDomain: "nushopa-web.firebaseapp.com",
  projectId: "nushopa-web",
  storageBucket: "nushopa-web.firebasestorage.app",
  messagingSenderId: "997814702955",
  appId: "1:997814702955:web:25321038d3bd512350322e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Nushopa", {
    body: body || "",
    icon: "/icon.png", // must match the icon referenced in sendPush.js's webpush block
    data: payload.data || {},
  });
});

// Optional: route a tap on the notification back into the app.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const orderId = event.notification.data?.orderId;
  const url = orderId ? `/order-status/${orderId}` : "/";
  event.waitUntil(clients.openWindow(url));
});