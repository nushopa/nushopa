import { BsFillBasketFill } from "react-icons/bs";


const FloatingButton = ({
  onClick,
  badgeCount = 0,
  icon,
  position = "bottom-16 right-6",
  colorClass = "bg-mainGreen hover:bg-green-700",
  ariaLabel = "Floating action button",
}) => {
  return (
    <div className={`fixed ${position} z-50`}>
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex h-16 w-16 items-center justify-center rounded-full ${colorClass} text-white shadow-2xl active:scale-95 transition-all duration-300`}
      >
        <div className="relative">
          {icon ?? <BsFillBasketFill className="h-8 w-8" />}

          {badgeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-xs font-bold ring-2 ring-white">
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default FloatingButton;