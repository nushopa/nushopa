import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbShoppingBagCheck } from "react-icons/tb";
import UserDropdown from "./UserDropdown";
import SearchBar from "../search/SearchBar";
import { useLogoutUserMutation } from "../../../services/api";
import { clearUser } from "../../../redux/user";

const HeaderInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user from Redux
  const { user } = useSelector((state) => state.user);

  // Get profile picture from localStorage
  const profileImg = localStorage.getItem("profile-picture");

  const isLoggedIn = !!user;

  // RTK Query mutation — needed for mobile logout
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  // User initials for mobile avatar
  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "?";

  // FIX: Only navigate when searchQuery is non-empty.
  // Removed the else block that was redirecting to "/" on every mount/render,
  // which caused Company, Logistics, and Contact links to always bounce back home.
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`, { replace: true });
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    if (query?.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`, { replace: true });
    }
  };

  // Shared logout logic reused by mobile menu
  const handleLogout = async () => {
    const performLocalLogout = () => {
      dispatch(clearUser());
      localStorage.removeItem("token");
      localStorage.removeItem("profile-picture");
      setIsMenuOpen(false);
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
    <>
      {/* Sticky wrapper */}
      <div className="sticky top-10 left-0 right-0 z-50 w-full flex justify-center px-3 sm:px-5 py-4 bg-transparent">
        <header className="w-full h-[4rem] max-w-7xl bg-mainGreen text-white shadow-2xl rounded-full">
          <nav className="w-full max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Logo – left column */}
              <div className="flex-1 flex items-center justify-start">
                <Link to="/" className="flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/phantom1245/image/upload/v1748627228/farm2home/nushoper_White-1_pfwupl.png"
                    alt="Nushopa Logo"
                    className="h-9 w-auto"
                    loading="lazy"
                  />
                </Link>
              </div>

              {/* Middle Navigation – center column (desktop only) */}
              <div className="hidden md:flex items-center justify-center">
                {isLoggedIn && (
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder="Search products..."
                    showSuggestions={false}
                  />
                )}

                {!isLoggedIn && (
                  <div className="flex items-center gap-10 font-medium">
                    <Link to="/about-us" className="hover:text-green-200 transition-colors">
                      Company
                    </Link>
                    <Link to="/logistics" className="hover:text-green-200 transition-colors">
                      Logistics
                    </Link>
                    <Link to="/contact" className="hover:text-green-200 transition-colors">
                      Contact
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Navigation – desktop only */}
              <div className="hidden md:flex flex-1 items-center justify-end gap-8">
                <div className="flex items-center gap-5">
                  {!isLoggedIn && (
                    <>
                      <Link
                        to="/sign-in"
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#FFEA00] text-mainGreen hover:bg-gray-100 font-medium rounded-lg transition-all shadow-sm text-sm"
                      >
                        <FaSignInAlt className="text-base" />
                        Login
                      </Link>
                      <div className="h-6 w-px bg-green-400/50" />
                    </>
                  )}

                  <Link
                    to="/"
                    className="relative group p-2 bg-white rounded-full hover:bg-green-700/30 transition-colors"
                  >
                    <FaShoppingCart className="text-xl text-mainGreen" />
                  </Link>

                  {isLoggedIn && <div className="h-6 w-px bg-green-400/50" />}

                  {/* UserDropdown — desktop only */}
                  {isLoggedIn && (
                    <UserDropdown user={user} profileImg={profileImg} />
                  )}
                </div>
              </div>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden p-2 rounded-md bg-green-700 hover:bg-green-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* ─── Mobile Menu ─── */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-green-600/30 bg-mainGreen rounded-b-3xl">
                <div className="flex flex-col gap-1">

                  {/* ── Logged-in: user info + nav items inline ── */}
                  {isLoggedIn ? (
                    <>
                      {/* User identity row */}
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-green-600/30 mb-1">
                        {profileImg ? (
                          <img
                            src={profileImg}
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover border-2 border-white/40"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#FFEA00] text-mainGreen font-bold flex items-center justify-center text-sm uppercase flex-shrink-0">
                            {userInitials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-green-200 truncate">{user?.email}</p>
                        </div>
                      </div>

                      {/* My Order */}
                      <Link
                        to="/my-order"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-5 py-3 text-white hover:bg-green-700/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <TbShoppingBagCheck className="text-xl" />
                          <span className="font-medium">My Order</span>
                        </div>
                        <FaLongArrowAltRight className="text-green-300" />
                      </Link>

                      {/* Cart */}
                      <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-5 py-3 text-white hover:bg-green-700/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FaShoppingCart className="text-xl" />
                          <span className="font-medium">Cart</span>
                        </div>
                        <FaLongArrowAltRight className="text-green-300" />
                      </Link>

                      {/* Support */}
                      <Link
                        to="/contact"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-5 py-3 text-white hover:bg-green-700/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BiSupport className="text-xl" />
                          <span className="font-medium">Support</span>
                        </div>
                        <FaLongArrowAltRight className="text-green-300" />
                      </Link>

                      {/* Logout */}
                      <div className="border-t border-green-600/30 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 px-5 py-3 text-red-300 hover:bg-green-700/40 w-full text-left transition-colors disabled:opacity-50"
                        >
                          <FaSignOutAlt className="text-xl" />
                          <span className="font-medium">
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* ── Logged-out: public nav + login ── */
                    <>
                      <Link
                        to="/about-us"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-5 py-3 text-white font-medium hover:bg-green-700/40 transition-colors"
                      >
                        Company
                      </Link>
                      <Link
                        to="/logistics"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-5 py-3 text-white font-medium hover:bg-green-700/40 transition-colors"
                      >
                        Logistics
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-5 py-3 text-white font-medium hover:bg-green-700/40 transition-colors"
                      >
                        Contact
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-5 py-3 text-white font-medium hover:bg-green-700/40 transition-colors flex items-center gap-3"
                      >
                        <FaShoppingCart className="text-xl" />
                        Cart
                      </Link>
                      <div className="px-5 pt-3 pb-2">
                        <Link
                          to="/sign-in"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFEA00] text-mainGreen font-semibold rounded-xl transition-all"
                        >
                          <FaSignInAlt />
                          Login
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </nav>
        </header>
      </div>
    </>
  );
};

export default HeaderInfo;