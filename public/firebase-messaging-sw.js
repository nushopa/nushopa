/* eslint-disable no-undef */
/* global importScripts,  firebase */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA0PjctaYaZhaN0iTx0CYa3XjqKpmE5HHk",
  authDomain: "nushopa-3e02e.firebaseapp.com",
  projectId: "nushopa-3e02e",
  storageBucket: "nushopa-3e02e.firebasestorage.app",
  messagingSenderId: "53761534400",
  appId: "1:53761534400:web:eb3dd83b6adda245ed4025",
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
  const { orderId, route } = event.notification.data || {};
  const url = route || (orderId ? `/order-status/${orderId}` : "/");
  event.waitUntil(clients.openWindow(url));
});
