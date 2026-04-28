import { useState, useRef, useEffect } from "react";
import { FaSignOutAlt, FaLongArrowAltRight } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbShoppingBagCheck } from "react-icons/tb";
import { useLogoutUserMutation } from "../../../services/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../../redux/user";

const UserDropdown = ({ user, profileImg }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // RTK Query mutation
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "?";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isDropdownOpen) {
        setIsDropdownOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    buttonRef.current?.focus();
  };

  // ==================== MAIN LOGOUT LOGIC ====================
  const handleLogout = async () => {
    const performLocalLogout = () => {
      dispatch(clearUser());
      localStorage.removeItem("token");
      localStorage.removeItem("profile-picture");
      setIsDropdownOpen(false);
      navigate("/sign-in", { replace: true });
    };

    try {
      await logoutApi().unwrap();
    } catch (_backendError) {
      console.warn("Backend logout failed, proceeding with local logout.");
    } finally {
      performLocalLogout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center gap-3 rounded-full p-1"
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
      >
        {profileImg ? (
          <img
            src={profileImg}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover border-2 border-white/40"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#FFEA00] text-mainGreen font-bold flex items-center justify-center text-lg uppercase">
            {userInitials}
          </div>
        )}
        <span className="font-medium  lg:inline">
          Hi, {user?.first_name || "User"}
        </span>


       
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex gap-3">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#FFEA00] text-mainGreen font-bold flex items-center justify-center text-sm uppercase">
                  {userInitials}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <a
              href="/my-order"
              role="menuitem"
              onClick={closeDropdown}
              className="flex items-center justify-between gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
            >
              <div className="flex  items-center gap-2">
                <TbShoppingBagCheck className="text-lg" />
                <span>My order</span>
              </div>
              <FaLongArrowAltRight />
            </a>

            <a
              href="/contact"
              role="menuitem"
              onClick={closeDropdown}
              className="flex items-center justify-between gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
            >
              <div className="flex  items-center gap-2">
                <BiSupport className="text-lg" />
                <span>Support</span>
              </div>
              <FaLongArrowAltRight />
            </a>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 w-full text-left transition-colors disabled:opacity-50"
            >
              <FaSignOutAlt className="text-lg" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
