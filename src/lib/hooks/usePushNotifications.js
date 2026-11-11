import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getMessagingIfSupported, VAPID_KEY } from "../firebase";
import useAuth from "./useAuth";

const DEVICE_ID_KEY = "nushopa_device_id";
const API_BASE = import.meta.env.VITE_BASE_URL;

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function usePushNotifications() {
  const { isAuthenticated, user } = useAuth();
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined"
      ? Notification.permission
      : "unsupported",
  );
  const [error, setError] = useState("");

  const registerCurrentDevice = useCallback(async () => {
    if (typeof Notification === "undefined") return null;
    if (!VAPID_KEY) {
      throw new Error("Push is not configured. Set VITE_FIREBASE_VAPID_KEY.");
    }

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

    if (!API_BASE) throw new Error("VITE_BASE_URL is not configured.");
    const response = await fetch(
      `${API_BASE.replace(/\/?$/, "/")}device/devices/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends the auth cookie so getOptionalUserId can attach userId
        body: JSON.stringify({
          deviceId,
          webPushToken,
          platform: "web",
        }),
      },
    );
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || "Could not register this device.");
    }

    return webPushToken;
  }, []);

  const requestPermissionAndRegister = useCallback(async () => {
    setError("");
    try {
      if (typeof Notification === "undefined") return null;

      const result =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return null;
      return await registerCurrentDevice();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not register this device for push notifications.";
      console.error(message, requestError);
      setError(message);
      return null;
    }
  }, [registerCurrentDevice]);

  useEffect(() => {
    if (permission !== "granted" || !isAuthenticated || !user?._id) return;
    registerCurrentDevice().catch((registrationError) => {
      const message =
        registrationError instanceof Error
          ? registrationError.message
          : "Could not register this device for push notifications.";
      console.error(message, registrationError);
      setError(message);
    });
  }, [isAuthenticated, permission, registerCurrentDevice, user?._id]);

  // Foreground messages: the browser won't show these automatically
  // (that's only for background/tab-closed via the service worker), so
  // handle them here — e.g. with a toast library.
  useEffect(() => {
    let unsubscribe;

    getMessagingIfSupported().then((messaging) => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        const notification = payload.notification;
        if (Notification.permission === "granted" && notification) {
          const foregroundNotification = new Notification(
            notification.title || "Nushopa",
            {
              body: notification.body || "",
              icon: "/icon.png",
              data: payload.data || {},
            },
          );
          foregroundNotification.onclick = () => {
            const data = payload.data || {};
            const target =
              data.route ||
              (data.orderId
                ? `/order-status/${encodeURIComponent(data.orderId)}`
                : "/");
            window.focus();
            window.location.assign(target);
          };
        }
      });
    });

    return () => unsubscribe?.();
  }, []);

  return { permission, requestPermissionAndRegister, error };
}
