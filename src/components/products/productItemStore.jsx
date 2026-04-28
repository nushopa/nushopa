import { useEffect, useState } from "react";
import { truncateString } from "../../lib/util/truncateString";
import {
  useAddToCartMutation,
  useDecrementMutation,
  useIncrementMutation,
} from "../../services/cart";
import DisplayContent from "../molecule/displayContent";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCarte } from "../../redux/cart";
import ProductImage from "../atoms/productImage";
import AddCommasToNumber from "../../lib/util/addComma";

export default function ProductItemStore({
  product_des,
  product_price,
  product_image,
  product_total,
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
  
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();
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
    try {
      const response = await increment({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        dispatch(setCarte(updatedCartData.data.cart));
        const updatedCartItem = updatedCartData.data.cart.find(
          (item) => item._id === productId
        );
        setProductQuantity(updatedCartItem.product_quatity);
      }
    } catch (error) {
      // Handle error
    }
  };

  const handleDecrement = async (productId) => {
    try {
      const response = await decrement({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        dispatch(setCarte(updatedCartData.data.cart));
        const updatedCartItem = updatedCartData.data.cart.find(
          (item) => item._id === productId
        );
        setProductQuantity(updatedCartItem.product_quatity);
        setShowQuantityDiv(updatedCartItem.product_quatity > 0);
      } else if (response.error.status === 404) {
        setShowQuantityDiv(false);
      }
    } catch (error) {
      setShowQuantityDiv(false);
      // Handle error
    }
  };

  const handleAddToCart = async (_id) => {
    setIsAddingToCart(true);
    const postDataInfo = {
      customer_id: userId,
      product_id: _id,
    };
    if (userId !== null) {
      try {
        const res = await addToCart(postDataInfo);
        if (res.data.product) {
          const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
          dispatch(setCarte(updatedCartData.data.cart));
          const newCartItem = updatedCartData.data.cart.find(
            (item) => item.product_id._id === _id
          );
          setProductQuantity(newCartItem.product_quatity);
          setCartId(newCartItem._id);
          setShowQuantityDiv(true);
        }
      } catch (e) {
        // Handle error
      } finally {
        setIsAddingToCart(false);
      }
    } else {
      navigate("/sign-in");
    }
  };

  // Truncate product_des and product_name
  const truncatedProductDes = truncateString(product_des, productDesMaxLength);
  const truncatedProductName = truncateString(product_name, productNameMaxLength);

  return (
    <Card
      onClick={() => navigate(`/product/${_id}`)}
      // Use flex-col on mobile, flex-row on medium+
      className="w-full flex flex-col md:flex-row cursor-pointer !z-[0] p-2"
    >
      <CardHeader
        shadow={false}
        floated={false}
        // Fix height and width for mobile to ensure regularity
        className="w-full md:w-auto h-40 md:h-52 max-h-[8rem] m-0"
      >
        <ProductImage
          product_image={product_image}
          truncatedProductName={truncatedProductName}
         
        />
      </CardHeader>
      <CardBody className="p-2">
        <div className="mb-0 md:mb-2 flex flex-col">
          <Typography
            className="font-medium truncate text-mainGreen"
            title={product_name}
          >
            {product_name}
          </Typography>
          <Typography className="font-medium">
            &#x20A6;{AddCommasToNumber(product_price)}
          </Typography>
        </div>
        <Typography
          variant="small"
          color="gray"
          className="font-normal flex opacity-75"
          title={product_des}
        >
          <DisplayContent htmlContent={truncatedProductDes} />
        </Typography>
        <div className="pt-3">
          {showQuantityDiv ? (
            <div className="w-full h-[30px] pt-2 flex justify-center items-center gap-2">
              <div className="h-[45px] flex items-center gap-2">
                <div className="bg-white rounded-[10px] border border-mainGreen flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrement(cartId);
                    }}
                    className="px-7 md:px-9 py-2 rounded-l-[10px] border-r border-mainGreen"
                  >
                    -
                  </button>
                  <div className="px-7 md:px-9 flex items-center">
                    <div className="text-neutral-500 text-xl font-medium">
                      {productQuantity}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrement(cartId);
                    }}
                    className="px-7 md:px-9 py-2 rounded-r-[10px] border-l border-mainGreen"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              ripple={false}
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(_id);
              }}
              disabled={isAddingToCart || product_total <= 0}
              className="bg-mainGreen text-white shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              {product_total <= 0 ? "OUT OF STOCK" : "Add to Cart"}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
