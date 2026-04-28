import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearUser } from "../../../redux/user";
import {
  Chip,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import { clearDelivery } from "../../../redux/delivery";
import axios from "axios";
import {
  // CogIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  // UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

const DesktopNavigation = ({ navigationItems }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [cart, setCart] = useState([]);
  const { carte } = useSelector((state) => state.carte);
  const [searchField, setSearchField] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    let baseUrl = import.meta.env.VITE_BASE_URL;
    if (userId !== null) {
      axios.get(`${baseUrl}cart/get/${userId}`).then((response) => {
        if (response.data) {
          setCart(response.data.cart);
        }
      });
    }

    axios
      .get(`${baseUrl}product`)
      .then((response) => {
        if (response.data) {
          setDetails(response.data.products);
          setFilteredDetails(response.data.products);
        }
      })
      .catch(() => {});
  }, []);

  // Update filteredDetails whenever searchField changes
  useEffect(() => {
    const filteredProducts = details.filter(
      (product) =>
        product.product_name
          .toLowerCase()
          .includes(searchField.toLowerCase()) ||
        product.product_cat.toLowerCase().includes(searchField.toLowerCase()) ||
        product.product_brand_name
          .toLowerCase()
          .includes(searchField.toLowerCase()) ||
        product.product_sub_cat
          .toLowerCase()
          .includes(searchField.toLowerCase())
    );
    setFilteredDetails(filteredProducts);
  }, [searchField, details]);
  const handleSearch = () => {
    if (searchField.trim() !== "") {
      const query = encodeURIComponent(searchField.trim());
      navigate(`/?q=${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setSearchField("");
    }
  };

  const userInitals = user?.first_name[0] + user?.last_name[0];

  const defaultStyle = "font-bold  text-md capitalize";
  const activeLinkStyle =
    "after:absolute after:bg-gradient-to-r text-green-900 from-green-900 to-green-400 after:w-full after:h-[3px] after:bottom-[-8px] after:left-0";

  const location = window.location.pathname;
  const getProperStyle = (link) => {
    if (location.slice(1).includes(link.url)) {
      return ` ${activeLinkStyle} ${defaultStyle}`;
    } else if ("/".includes(link.url) === location[0]) {
      return ` ${activeLinkStyle} ${defaultStyle}`;
    }
    return defaultStyle;
  };
  const handleSignIn = () => {
    navigate("/sign-in");
  };
  const handleSignUp = () => {
    navigate("/sign-up");
  };
  const handleMyOrders = () => {
    navigate("/my-order");
  };
  const handleHelp = () => {
    navigate("/help");
  };
  const handleToggleClick = () => {
    setIsCollapseOpen(!isCollapseOpen);
  };
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear Redux store using userSlice action
    dispatch(clearUser());
    dispatch(clearDelivery());
    navigate("/");
    // Add additional logout logic if needed
  };
  // Function to get unique products based on product_id
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
  const profileImg = localStorage.getItem("profile-picture");
  return (
    <div className="items-center text-[#000] w-full justify-between hidden md:flex">
      <div>
        <div className="flex rounded-lg shadow-sm">
          <input
            type="text"
            name="search-input"
            placeholder="What would you like to order today?"
            className="py-3 bg-transparent px-4 block w-full text-[#000] border border-green-900 shadow-sm rounded-s-lg text-sm focus:z-10 outline-none disabled:opacity-50 disabled:pointer-events-none"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="py-3 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-mainGreen text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Search
          </button>
        </div>
      </div>
      {searchField && filteredDetails.length > 0 && (
        <Card className="w-96 h-[20rem] overflow-y-auto absolute top-20">
          {filteredDetails?.map((item, index) => (
            <List key={index}>
              <ListItem onClick={() => navigate(`/product/${item._id}`)}>
                <ListItemPrefix>
                  <Avatar
                    variant="circular"
                    alt="candice"
                    src={item?.product_image}
                  />
                </ListItemPrefix>
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {item?.product_name}
                  </Typography>
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-normal"
                  >
                    {item?.product_cat}
                  </Typography>
                </div>
              </ListItem>
            </List>
          ))}
        </Card>
      )}
      <nav className="flex gap-5 flex-wrap">
        {navigationItems.map((link) => (
          <div key={link.label} className="relative cursor-pointer">
            <Link
              to={link.label === "Home" ? "/" : `/${link.url}`}
              className={`${getProperStyle(link)}`}
            >
              <p>{link.label}</p>
            </Link>
          </div>
        ))}
      </nav>
      <div className="flex gap-2">
        {user && cart !== undefined ? (
          <div className="flex gap-2 justify-center items-center">
            <button
              onClick={() => navigate("/cart")}
              className="w-[10rem] cursor-pointer relative h-[2.7rem] bg-mainGreen rounded-[10px] justify-center items-center gap-2 inline-flex"
            >
              <div className=" text-white text-sm font-normal font-workSans leading-snug tracking-wide">
                Track Your Order
              </div>
              {carte?.length > 0 ? (
                <Chip
                  value={getUniqueProducts(carte)?.length}
                  className=" text-white rounded-full w-8 h-8 text-center absolute -top-5 -right-3 bg-gray-800 text-md font-normal font-workSans tracking-tight"
                />
              ) : null}
            </button>
            {profileImg ? (
              <div className=" uppercase w-[2.5rem] h-[2.5rem] inline-flex justify-center items-center ">
                <img
                  src={profileImg}
                  alt={userInitals}
                  className=" rounded-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className=" uppercase w-[2.5rem] h-[2.5rem] text-white rounded-full bg-mainGreen inline-flex justify-center items-center ">
                {userInitals}
              </div>
            )}

            <div className="capitalize">Hi, {user?.first_name}</div>
            <div className="relative">
              <button
                type="button"
                className="hs-collapse-toggle py-3 px-4 inline-flex border-none outline-none items-center gap-x-2 text-sm font-semibold text-mainGreen disabled:opacity-50 disabled:pointer-events-none static right-0"
                onClick={handleToggleClick}
                aria-expanded={isCollapseOpen}
              >
                <svg
                  className={`rotate-${
                    isCollapseOpen ? "180" : "0"
                  } flex-shrink-0 w-4 h-4 text-mainGreen`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div
                id="hs-basic-collapse-heading"
                className={`hs-collapse absolute top-10 left-[-100px] w-48 bg-white rounded-md shadow-lg transition-all duration-300 z-50 ${
                  isCollapseOpen ? "block" : "hidden"
                }`}
                aria-labelledby="hs-basic-collapse"
                role="menu"
              >
                <ul className="flex flex-col">
                  {/* My Orders */}
                  <li>
                    <button
                      onClick={handleMyOrders}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-700 hover:bg-gray-100 transition-colors" />
                      <span className=" font-medium">My Orders</span>
                    </button>
                  </li>

                  {/* Profile */}
                  {/*                   
                  <li>
                    <button
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      <UserIcon className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">Profile</span>
                    </button>
                  </li> */}

                  {/* Settings */}
                  {/* <li>
                    <button
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      <CogIcon className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">Settings</span>
                    </button>
                  </li> */}

                  {/* Help Center */}
                  <li>
                    <button
                      onClick={handleHelp}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      role="menuitem"
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">Help Center</span>
                    </button>
                  </li>

                  {/* Divider */}
                  <li>
                    <hr className="my-1 border-gray-200" />
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-white bg-mainGreen hover:bg-green-700 rounded-b-md transition-colors"
                      role="menuitem"
                    >
                      <XCircleIcon className="h-5 w-5 mr-3 text-white" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <button
                onClick={handleSignIn}
                className="w-[6rem] py-2 rounded-md text-mainGreen bg-transparent border border-green-900"
              >
                Sign In
              </button>
            </div>
            <div>
              <button
                onClick={handleSignUp}
                className="w-[6rem] py-2 rounded-md text-white bg-mainGreen border border-green-900"
              >
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNavigation;
