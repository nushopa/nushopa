import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  CardHeader,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/defaultLayout";
import {
  useIncrementMutation,
  useDecrementMutation,
  useDeleteSingleCartMutation,
} from "../../services/cart";
import { useEffect, useState } from "react";
import axios from "axios";
import { truncateString } from "../../lib/util/truncateString";
import DisplayContent from "../molecule/displayContent";
import { Helmet } from "react-helmet-async";
import AddCommasToNumber from "../../lib/util/addComma";
import DeleteIcon from "../icons/deleteIcon";

const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center pt-44">
      <span className="cartLoader"></span>
    </div>
  );
};

const Cart = () => {
  let navigate = useNavigate();
  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();
  const [deleteCart] = useDeleteSingleCartMutation();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  let baseUrl = import.meta.env.VITE_BASE_URL;

  let userId = localStorage.getItem("userId");
  useEffect(() => {
    axios
      .get(`${baseUrl}cart/get/${userId}`)
      .then((response) => {
        if (response.data) {
          setCarts(response.data.cart);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, userId]);

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

  const handleRemoveItem = async (productId) => {
    try {
      const response = await deleteCart({ id: productId });
      if (response.data) {
        const updatedCartData = await axios.get(`${baseUrl}cart/get/${userId}`);
        setCarts(updatedCartData.data.cart);
      }
    } catch (error) {
      // toast.error("Error deleting cart");
    }
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

  return (
    <DefaultLayout>
      <Helmet>
        <title>Nushopa | Cart</title>
        <meta
          name="description"
          content="Review and manage your shopping cart at Nushopa. Explore the fresh, locally-sourced produce you've selected and proceed to checkout with ease. Your farm-to-table experience is just a click away – shop now and enjoy convenient delivery straight to your doorstep!"
        />
      </Helmet>

      {loading && <Loader />}
      <div className="mx-auto px-4 md:px-8">
        <Button
          onClick={() => navigate("/")}
          className="my-6 rounded-[10px] border bg-transparent border-mainGreen flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-6 h-6 text-mainGreen" />
          <span className="text-mainGreen text-sm md:text-base font-medium font-workSans">
            Continue Shopping
          </span>
        </Button>
        <div className="mb-6">
          <span className="pl-4 text-black text-lg md:text-2xl font-medium font-workSans">
            My Shopping cart
          </span>
          {carts?.length > 0 && (
            <span className="pl-2 text-black text-sm md:text-md font-normal font-workSans">
              ({getUniqueProducts(carts)?.length})
            </span>
          )}
        </div>
        {carts?.length === 0 ? (
          <div>
            <Card className="my-6 mx-auto flex flex-col items-center w-full md:w-[90%] p-4">
              <CardHeader className="w-full flex justify-center">
                <img
                  src="https://res.cloudinary.com/phantom1245/image/upload/v1703979330/farm2home/9960436-removebg-preview_qeehze.png"
                  alt="Empty cart"
                  className="h-40"
                  loading="lazy"
                />
              </CardHeader>
              <CardBody className="text-center">
                <Typography variant="h5" className="mb-2">
                  Your cart is empty.
                </Typography>
              </CardBody>
              <CardFooter className="pt-0">
                <Button onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 my-5 w-full">
            <div className="w-full md:w-4/5 rounded-md bg-white shadow p-4">
              {getUniqueProducts(carts)?.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row gap-3 items-start border-b border-gray-300 py-2"
                >
                  <div className="flex w-full md:w-1/2">
                    <div className="w-1/2 md:w-1/3">
                      <img
                        src={item.product_id.product_image}
                        alt={item.product_id.product_name}
                        className="w-full h-auto rounded-lg object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-1/2 md:w-2/3 pl-2 md:pl-4">
                      <h2 className="text-mainGreen text-sm md:text-lg font-medium capitalize">
                        {item.product_id.product_name}
                      </h2>
                      <p className="text-sm md:text-md text-black font-medium">
                        &#8358;{AddCommasToNumber(item.product_id.product_price)}
                      </p>
                      <p className="hidden md:block text-gray-800 text-base">
                        <DisplayContent
                          htmlContent={truncateString(
                            item.product_id.product_des,
                            100
                          )}
                        />
                      </p>
                      <p className="md:hidden text-gray-800 text-base">
                        <DisplayContent
                          htmlContent={truncateString(
                            item.product_id.product_des,
                            23
                          )}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between w-full mt-3 md:mt-0 md:w-1/2">
                    <div className="bg-white rounded-lg border border-mainGreen flex">
                      <button
                        onClick={() => handleDecrement(item._id)}
                        className="px-2 py-1 border-r border-mainGreen text-mainGreen"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-neutral-500 font-medium">
                        {item.product_quatity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item._id)}
                        className="px-2 py-1 border-l border-mainGreen text-mainGreen"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm md:text-md text-black font-medium">
                      &#8358;
                      {AddCommasToNumber(item.product_id.product_price * item.product_quatity)}
                    </p>
                    <button onClick={() => handleRemoveItem(item._id)}>
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/3 rounded-md bg-white shadow p-4">
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <span className="text-lg md:text-xl font-medium">
                  Order Summary
                </span>
                <span className="text-md font-medium text-black">
                  {carts.length > 0 && (
                    <span>({getUniqueProducts(carts).length}) items</span>
                  )}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center border-b border-gray-300 pb-2">
                <span className="text-gray-500 text-md font-medium">
                  SubTotal:
                </span>
                <span className="text-black text-md font-medium">
                  &#8358;
                  {AddCommasToNumber(
                    carts.reduce(
                      (total, item) =>
                        total +
                        item.product_id.product_price * item.product_quatity,
                      0
                    )
                  )}
                </span>
              </div>
              <Button
                className="mt-4 w-full "
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Cart;
