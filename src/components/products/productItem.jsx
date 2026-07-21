import { useEffect, useState } from "react";
import { truncateString } from "../../lib/util/truncateString";
import {
  useAddToCartMutation,
  useDecrementMutation,
  useDeleteSingleCartMutation,
  useIncrementMutation,
} from "../../services/cart";
import DisplayContent from "../molecule/displayContent";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import ProductImage from "../atoms/productImage";
import AddCommasToNumber from "../../lib/util/addComma";
import AddToCartIcon from "./AddToCartIcon";
import useAuth from "../../lib/hooks/useAuth";
import { setCartCount, setCarte } from "../../redux/cart";

// Helper: count unique products and dispatch badge update
const syncCartCount = (cartItems, dispatch) => {
  const uniqueIds = new Set(cartItems.map((i) => i.product_id._id));
  dispatch(setCartCount(uniqueIds.size));
};

export default function ProductItem({
  product_des,
  product_price,
  product_image,
  product_total,
  out_of_stock,
  productNameMaxLength,
  productDesMaxLength,
  product_name,
  _id,
  carter,
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuantityDiv, setShowQuantityDiv] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cartId, setCartId] = useState(null);
  let baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [addToCart] = useAddToCartMutation();
  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();
  const [deleteSingleCart] = useDeleteSingleCartMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const cartItem = carter.find((item) => item.product_id._id === _id);
    if (cartItem) {
      setCartId(cartItem._id);
      setProductQuantity(cartItem.product_quatity);
      setShowQuantityDiv(true);
    }
  }, [carter, _id]);

  const handleIncrement = async (productId) => {
    if (!isAuthenticated) { navigate("/sign-in"); return; }
    try {
      const userId = localStorage.getItem("userId");
      const response = await increment({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        const cart = updatedCartData.data.cart;
        dispatch(setCarte(cart));
        syncCartCount(cart, dispatch); // ← badge sync
        const updatedCartItem = cart.find((item) => item._id === productId);
        setProductQuantity(updatedCartItem.product_quatity);
      }
    } catch (error) {
      // handle error
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    if (!isAuthenticated) { navigate("/sign-in"); return; }
    if (!cartItemId) return;
    try {
      setIsAddingToCart(true);
      const response = await deleteSingleCart({ id: cartItemId });
      if (response.data) {
        const userId = localStorage.getItem("userId");
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        const cart = updatedCartData.data.cart;
        dispatch(setCarte(cart));
        syncCartCount(cart, dispatch); // ← badge sync
        setShowQuantityDiv(false);
        setProductQuantity(1);
        setCartId(null);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDecrement = async (productId) => {
    if (!isAuthenticated) { navigate("/sign-in"); return; }
    try {
      const userId = localStorage.getItem("userId");
      const response = await decrement({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        const cart = updatedCartData.data.cart;
        dispatch(setCarte(cart));
        syncCartCount(cart, dispatch); // ← badge sync
        const updatedCartItem = cart.find((item) => item._id === productId);
        setProductQuantity(updatedCartItem.product_quatity);
        setShowQuantityDiv(updatedCartItem.product_quatity > 0);
      } else if (response.error.status === 404) {
        setShowQuantityDiv(false);
      }
    } catch (error) {
      setShowQuantityDiv(false);
    }
  };

  const handleAddToCart = async (_id) => {
    if (!isAuthenticated) { navigate("/sign-in"); return; }
    if (out_of_stock) return; // guard against stray clicks/enter key
    const userId = localStorage.getItem("userId");
    setIsAddingToCart(true);
    const postDataInfo = { customer_id: userId, product_id: _id };
    try {
      const res = await addToCart(postDataInfo);
      if (res.data.product) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        const cart = updatedCartData.data.cart;
        dispatch(setCarte(cart));
        syncCartCount(cart, dispatch); // ← badge sync
        const newCartItem = cart.find((item) => item.product_id._id === _id);
        setProductQuantity(newCartItem.product_quatity);
        setCartId(newCartItem._id);
        setShowQuantityDiv(true);
      }
    } catch (e) {
      // handle error
    } finally {
      setIsAddingToCart(false);
    }
  };

  const truncatedProductDes = truncateString(product_des, productDesMaxLength);
  const truncatedProductName = truncateString(product_name, productNameMaxLength);

  return (
    <Card className="w-56 md:w-72">
      <CardHeader
        shadow={false}
        floated={false}
        className="h-40 md:h-52 cursor-pointer relative"
        onClick={() =>
          isAuthenticated ? navigate(`/product/${_id}`) : navigate("/sign-in")
        }
      >
        <div className="flex bg-[#F2F2F2] w-full justify-center rounded-sm p-6">
          <ProductImage
            product_image={product_image}
            truncatedProductName={truncatedProductName}
          />
          
          <div
            className="absolute top-2 right-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <AddToCartIcon
              isSelected={showQuantityDiv}
              isLoading={isAddingToCart}
              disabled={out_of_stock || product_total <= 0}
              onClick={() =>
                showQuantityDiv
                  ? handleRemoveFromCart(cartId)
                  : handleAddToCart(_id)
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="mb-2 flex md:flex-row flex-col md:items-center md:justify-between">
          <Typography
            className="font-medium text-mainGreen truncate"
            title={product_name}
          >
            {product_name}
          </Typography>
        </div>
        {out_of_stock && (
          <Typography variant="small" className="text-red-600 font-semibold mb-1">
            Out of Stock
          </Typography>
        )}
        <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75"
          title={product_des}
        >
          <DisplayContent htmlContent={truncatedProductDes} />
        </Typography>
      </CardBody>
      <CardFooter className="px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <Typography className="font-bold text-lg shrink-0">
            &#x20A6;{AddCommasToNumber(product_price)}
          </Typography>
          {showQuantityDiv && !out_of_stock && (
            <div className="flex items-center justify-end flex-1">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDecrement(cartId)}
                  className="px-3 rounded-[6px] bg-mainGreen text-white flex justify-center items-center"
                >
                  -
                </button>
                <div className="flex-1 flex justify-center items-center py-2">
                  <span className="text-neutral-500 text-xl font-medium font-workSans">
                    {productQuantity}
                  </span>
                </div>
                <button
                  onClick={() => handleIncrement(cartId)}
                  className="px-3 rounded-[6px] bg-mainGreen text-white flex justify-center items-center"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}