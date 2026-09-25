import { FaBell, FaBellSlash, FaLongArrowAltRight } from "react-icons/fa";
import { usePushNotifications } from '../../lib/hooks/usePushNotifications';

const NotificationBell = ({ variant = "icon", onNavigate }) => {
  const { permission, requestPermissionAndRegister } = usePushNotifications();

  if (permission === "unsupported") return null;

  const isSettled = permission === "granted" || permission === "denied";

  const handleClick = async () => {
    onNavigate?.();
    if (isSettled) return; // "denied" can only be undone in browser settings; "granted" needs no action
    await requestPermissionAndRegister();
  };

  const label =
    permission === "granted"
      ? "Notifications on"
      : permission === "denied"
        ? "Notifications blocked"
        : "Enable notifications";

  const Icon = permission === "denied" ? FaBellSlash : FaBell;

  if (variant === "menu-item") {
    return (
      <button
        onClick={handleClick}
        disabled={isSettled}
        className="flex items-center justify-between px-5 py-3 text-white hover:bg-green-700/40 transition-colors w-full text-left disabled:opacity-70 disabled:hover:bg-transparent"
      >
        <div className="flex items-center gap-3">
          <Icon className="text-xl" />
          <span className="font-medium">{label}</span>
        </div>
        {!isSettled && <FaLongArrowAltRight className="text-green-300" />}
      </button>
    );
  }

  if (variant === "dropdown-item") {
    return (
      <button
        onClick={handleClick}
        disabled={isSettled}
        role="menuitem"
        className="flex items-center justify-between gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left disabled:opacity-70 disabled:hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          <Icon className="text-lg" />
          <span>{label}</span>
        </div>
        {!isSettled && <FaLongArrowAltRight />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isSettled}
      title={label}
      aria-label={label}
      className="relative p-2 bg-white rounded-full hover:bg-green-700/30 transition-colors disabled:hover:bg-white"
    >
      <Icon className="text-xl text-mainGreen" />
    </button>
  );
};

export default NotificationBell;