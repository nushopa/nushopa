import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Chip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../../redux/user";
import { clearDelivery } from "../../../redux/delivery";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PowerIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

// Profile menu component (optional dropdown for desktop)
const profileMenuItems = [
  {
    label: "My Orders",
    icon: UserCircleIcon,
    action: "myOrders", // custom property to denote action type
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    action: "signOut",
  },
];

export function MbileNavbar({ navigationItems }) {
  const [openNav, setOpenNav] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [cart, setCart] = useState([]);
  const { carte } = useSelector((state) => state.carte);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let baseUrl = import.meta.env.VITE_BASE_URL;
    if (userId !== null) {
      axios
        .get(`${baseUrl}cart/get/${userId}`)
        .then((response) => {
          if (response.data) {
            setCart(response.data.cart);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const userInitals = user?.first_name[0] + user?.last_name[0];

  const handleSignIn = () => {
    navigate("/sign-in");
  };
  const handleSignUp = () => {
    navigate("/sign-up");
  };
  const handleMyOrders = () => {
    navigate("/my-order");
  };

  const handleLogout = () => {
    // Clear localStorage and Redux store
    localStorage.clear();
    dispatch(clearUser());
    dispatch(clearDelivery());
    navigate("/");
  };

  // Helper to get unique products from the cart
  const getUniqueProducts = (cart) => {
    const uniqueProducts = [];
    const productIds = new Set();
    cart.forEach((item) => {
      if (!productIds.has(item.product_id._id)) {
        productIds.add(item.product_id._id);
        uniqueProducts.push(item);
      }
    });
    return uniqueProducts;
  };

  // (Optional) Desktop ProfileMenu component – adjust or remove if using integrated navigation
  function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);
    const profileImg = localStorage.getItem("profile-picture");
    return (
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto">
            {profileImg ? (
              <div className="uppercase w-[2.5rem] h-[2.5rem] inline-flex justify-center items-center">
                <img
                  src={profileImg}
                  alt={userInitals}
                  className="rounded-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="uppercase w-[2.5rem] h-[2.5rem] text-white rounded-full bg-mainGreen inline-flex justify-center items-center">
                {userInitals}
              </div>
            )}
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          {profileMenuItems.map(({ label, icon, action }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => {
                  closeMenu();
                  if (action === "myOrders") {
                    handleMyOrders();
                  } else if (action === "signOut") {
                    handleLogout();
                  }
                }}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  }

  // Build an extended navigation list.
  // Start with the items passed as props.
  const extendedNavigationItems = navigationItems ? [...navigationItems] : [];

  // If a user is logged in, add "My Orders" and "Sign Out" to the list.
  if (user) {
    extendedNavigationItems.push({
      label: "My Orders",
      onClick: handleMyOrders,
      icon: UserCircleIcon,
    });
    extendedNavigationItems.push({
      label: "Sign Out",
      onClick: handleLogout,
      icon: PowerIcon,
    });
  }

  // Render the navigation list with icons (if provided)
  const navList = (
    <ul className="flex flex-col">
      {extendedNavigationItems.map((item, index) => (
        <Typography
          as="li"
          key={index}
          variant="small"
          className="p-2 font-normal text-black"
        >
          {item.url ? (
            <a href={item.url} className="flex items-center">
              {item.icon && (
                <span className="mr-2">
                  {React.createElement(item.icon, { className: "w-5 h-5" })}
                </span>
              )}
              {item.label}
            </a>
          ) : (
            <button
              onClick={item.onClick}
              className="flex items-center hover:text-mainGreen transition-colors"
            >
              {item.icon && (
                <span className="mr-2">
                  {React.createElement(item.icon, { className: "w-5 h-5" })}
                </span>
              )}
              {item.label}
            </button>
          )}
        </Typography>
      ))}
    </ul>
  );
  

  return (
    <div className="max-h-[780px] w-[calc(100%+48px)] border-b-2 border-mainGreen">
      <Navbar className="z-10 h-max max-w-full px-4 rounded-none text-mainGreen lg:px-8 lg:py-4">
        <div className="flex items-center justify-between">
          <Typography
            as="a"
            href="/"
            className="mr-5 text-lg font-workSans cursor-pointer py-1.5 font-bold"
          >
            Nushopa
          </Typography>
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              className="ml-auto flex justify-center relative items-center text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={true}
              onClick={() => setOpenNav(!openNav)}
              aria-label="Toggle navigation"
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <>
                  <Bars3Icon className="h-6 w-6" />
                  {carte?.length > 0 && user ? (
                    <Chip
                      value={getUniqueProducts(carte)?.length}
                      className="text-white rounded-full w-5 h-6 flex justify-center items-center text-left absolute -top-0 right-2.5 bg-gray-800 text-md font-normal font-workSans"
                    />
                  ) : null}
                </>
              )}
            </Button>
          </div>
          {/* Optionally, for larger screens show ProfileMenu */}
          {user ? <div className="hidden lg:block"><ProfileMenu /></div> : null}
        </div>
        <Collapse open={openNav}>
          {/* Demarcator (divider) between the main nav header and the navigation list */}
          <hr className="border-t border-gray-300 my-2" />
          {navList}
          <hr className="border-t border-gray-300 my-2" />
          <div className="flex w-full gap-2 mt-4">
            {user && cart !== undefined && !loading ? (
              <div className="flex w-1/2 gap-2 justify-center items-center">
                <div
                  onClick={() => navigate("/cart")}
                  className="w-full md:w-[10rem] cursor-pointer relative h-[2.7rem] bg-mainGreen rounded-[10px] justify-center items-center gap-2 inline-flex"
                >
                  <div className="text-white text-sm font-normal font-workSans leading-snug tracking-wide">
                    Track Your Order
                  </div>
                  {carte?.length > 0 ? (
                    <Chip
                      value={getUniqueProducts(carte)?.length}
                      className="text-white rounded-full w-8 h-8 text-center absolute -top-5 -right-3 bg-gray-800 text-md font-normal font-workSans tracking-tight"
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center gap-x-1">
                <Button
                  onClick={handleSignIn}
                  fullWidth
                  variant="outlined"
                  size="md"
                >
                  <span>Log In</span>
                </Button>
                <Button
                  onClick={handleSignUp}
                  fullWidth
                  size="md"
                  className="bg-mainGreen"
                >
                  <span>Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
}
