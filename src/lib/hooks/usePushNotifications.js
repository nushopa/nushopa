import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getMessagingIfSupported, VAPID_KEY } from "../firebase";

const DEVICE_ID_KEY = "nushopa_device_id";
const API_BASE = import.meta.env.VITE_API_BASE_URL; // e.g. https://api.yourapp.com

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}


export function usePushNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported",
  );

  const requestPermissionAndRegister = useCallback(async () => {
    if (typeof Notification === "undefined") return null;

    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") return null;

    const messaging = await getMessagingIfSupported();
    if (!messaging) {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    const webPushToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!webPushToken) return null;

    const deviceId = getOrCreateDeviceId();

    await fetch(`${API_BASE}/device/devices/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // sends the auth cookie so getOptionalUserId can attach userId
      body: JSON.stringify({
        deviceId,
        webPushToken,
        platform: "web",
      }),
    });

    return webPushToken;
  }, []);

  // Foreground messages: the browser won't show these automatically
  // (that's only for background/tab-closed via the service worker), so
  // handle them here — e.g. with a toast library.
  useEffect(() => {
    let unsubscribe;

    getMessagingIfSupported().then((messaging) => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push:", payload);
        // e.g. toast.info(payload.notification?.title);
      });
    });

    return () => unsubscribe?.();
  }, []);

  return { permission, requestPermissionAndRegister };
}