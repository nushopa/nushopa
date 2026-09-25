import { usePushNotifications } from "../hooks/usePushNotifications";

export default function EnableNotificationsButton() {
  const { permission, requestPermissionAndRegister } = usePushNotifications();

  if (permission === "granted") {
    return <p>✅ Notifications enabled</p>;
  }

  if (permission === "denied") {
    return (
      <p>
          Notifications are blocked. To enable them, allow notifications for
        this site in your browser&apos;s settings, then reload.
      </p>
    );
  }

  if (permission === "unsupported") {
    return null; // browser doesn't support the Notifications API — nothing to show
  }

  // permission === "default" — hasn't been asked yet
  return (
    <button onClick={requestPermissionAndRegister}>
      Enable order updates
    </button>
  );
}