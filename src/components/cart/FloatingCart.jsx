import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import AddCommasToNumber from "../../lib/util/addComma";
import { truncateString } from "../../lib/util/truncateString";
import DisplayContent from "../molecule/displayContent";
import {
  useIncrementMutation,
  useDecrementMutation,
  useDeleteSingleCartMutation,
} from "../../services/cart";
import DeleteIcon from "../icons/deleteIcon";
import FloatingButton from "./FloatingButton";
import { BsFillBasketFill } from "react-icons/bs";
import useAuth from "../../lib/hooks/useAuth";

const FloatingCart = () => {
  const { isAuthenticated, user } = useAuth();
  const userId = user?._id;

  const [isOpen, setIsOpen] = useState(false);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();
  const [deleteCart] = useDeleteSingleCartMutation();

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}cart/get/${userId}`);
        if (response.data?.cart) {
          setCarts(response.data.cart);
        }
      } catch (error) {
        console.error("Error fetching cart for floating cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isOpen, baseUrl, userId]);

  // ✅ All hooks are above this line — safe to early return
  if (!isAuthenticated) return null;

  const getUniqueProducts = (cartItems) => {
    const unique = [];
    const seen = new Set();
    cartItems.forEach((item) => {
      if (!seen.has(item.product_id._id)) {
        seen.add(item.product_id._id);
        unique.push(item);
      }
    });
    return unique;
  };

  const uniqueItems = getUniqueProducts(carts);

  const subtotal = carts.reduce((total, item) => {
    return total + (item.product_id.product_price * item.product_quatity || 0);
  }, 0);

  const handleClose = () => setIsOpen(false);

  const handleRemoveItem = async (cartItemId) => {
    setRemovingId(cartItemId);
    try {
      const response = await deleteCart({ id: cartItemId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        setCarts(updatedCartData.data.cart);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleIncrement = async (productId) => {
    try {
      const response = await increment({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        setCarts(updatedCartData.data.cart);
      }
    } catch (error) {
      //handle error
    }
  };

  const handleDecrement = async (productId) => {
    try {
      const response = await decrement({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        setCarts(updatedCartData.data.cart);
      }
    } catch (error) {
      // // toast.error("Error decrementing quantity");
    }
  };

  return (
    <>
      <FloatingButton
        onClick={() => setIsOpen(true)}
        badgeCount={uniqueItems.length}
        icon={<BsFillBasketFill className="h-8 w-8" />}
        ariaLabel="Open cart"
      />

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

          <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <BsFillBasketFill className="h-7 w-7 text-mainGreen" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  My Cart
                </h2>
                {uniqueItems.length > 0 && (
                  <span className="text-sm text-gray-500">
                    ({uniqueItems.length})
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-7 w-7 text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <span className="cartLoader"></span>
                </div>
              ) : uniqueItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <img
                    src="https://res.cloudinary.com/phantom1245/image/upload/v1703979330/farm2home/9960436-removebg-preview_qeehze.png"
                    alt="Empty cart"
                    className="h-40 mb-6"
                  />
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate("/");
                    }}
                    className="mt-6 px-8 py-3 bg-mainGreen text-white rounded-xl hover:bg-green-700"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                uniqueItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.product_id.product_image}
                        alt={item.product_id.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-mainGreen capitalize leading-tight">
                          {item.product_id.product_name}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={removingId === item._id}
                          className="flex-shrink-0 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Remove item"
                        >
                          {removingId === item._id ? (
                            <svg
                              className="animate-spin h-4 w-4 text-red-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              />
                            </svg>
                          ) : (
                            <DeleteIcon />
                          )}
                        </button>
                      </div>

                      <p className="text-gray-600 mt-1 text-sm">
                        ₦{AddCommasToNumber(item.product_id.product_price)}
                      </p>

                      <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                        <DisplayContent
                          htmlContent={truncateString(
                            item.product_id.product_des,
                            70,
                          )}
                        />
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex justify-between w-full mt-3 md:mt-0 md:w-1/2">
                          <div className=" flex">
                            <button
                              onClick={() => handleDecrement(item._id)}
                              className="px-2 py-1  text-white rounded-lg bg-mainGreen"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-neutral-500 font-medium">
                              {item.product_quatity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item._id)}
                              className="px-2 py-1  text-white rounded-lg bg-mainGreen"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <span className="font-semibold">
                          ₦
                          {AddCommasToNumber(
                            item.product_id.product_price *
                              item.product_quatity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {uniqueItems.length > 0 && (
              <div className="border-t p-6 bg-white space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span className="text-gray-700">Subtotal</span>
                  <span>₦{AddCommasToNumber(subtotal)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleClose();
                      navigate("/cart");
                    }}
                    className="py-3.5 border-2 border-mainGreen text-mainGreen font-medium rounded-xl hover:bg-green-50 transition"
                  >
                    View Full Cart
                  </button>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate("/checkout");
                    }}
                    className="py-3.5 bg-mainGreen hover:bg-green-700 text-white font-medium rounded-xl transition"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;
