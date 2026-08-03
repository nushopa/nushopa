import { useState, useCallback, useEffect } from "react";
import { StepperWithContent } from "../../components/atoms/stepper/stepper";
import DefaultLayout from "../../layouts/defaultLayout";
import AddressBook from "../../components/molecule/addressBook/addressBook";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import PaystackCheckout from "./paystackCheckout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import AddCommasToNumber from "../../lib/util/addComma";
import { toast } from "react-toastify";
import { clearUser } from "../../redux/user";
import { clearDelivery } from "../../redux/delivery";

export default function Checkout() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("delivery");
  const [estimatePrice, setEstimatePrice] = useState(null);
  const [existingArray, setExistingArray] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shop, setShop] = useState([])
  let navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  let userId = localStorage.getItem("userId");

  useEffect(() => {
    if (user?._id !== userId) {
      toast.info("Please relogin");
      localStorage.clear();

      // Clear Redux store using userSlice action
      dispatch(clearUser());
      dispatch(clearDelivery());
      navigate("/");
      navigate("/sign-in");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userId, navigate]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const addressResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}checkout/address/${userId}`
        );
        if (addressResponse.data.checkout) {
          setExistingArray(addressResponse.data.checkout);
        }

        const cartResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}cart/get/${userId}`
        );
        if (cartResponse.data) {
          setShop(cartResponse.data.cart);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [userId]);

  const handleDeliveryPrice = useCallback((estimatePrice) => {
    setEstimatePrice(estimatePrice);
  }, []);

  const subtotal = shop?.reduce(
    (total, item) =>
      total + item.product_id.product_price * item.product_quatity,
    0
  );

  const delivery = 1800;

  const serviceCharge = subtotal * 0.15;
  let total = subtotal + estimatePrice + serviceCharge;

  
  return (
    <DefaultLayout>
      <Helmet>
        <title>Nushopa | Address Book</title>
        <meta
          name="description"
          content="Manage your delivery addresses easily with Nushopa's Address Book feature. Add, edit, or remove addresses to ensure seamless delivery of your fresh, locally-sourced produce. Simplify your farm-to-table experience by keeping your address information up to date and enjoy hassle-free delivery straight to your doorstep!"
        />
      </Helmet>

      <div className="text-black text-2xl md:text-[40px] text-center my-3 font-bold font-workSans">
        Checkout
      </div>
      <div className="mb-20">
        <StepperWithContent
          activeStep={activeStep}
          setActiveStep={(step) => setActiveStep(step)}
        />
      </div>
      <div className="flex my-5 w-full justify-between items-start gap-4 px-1 md:px-10 flex-col md:flex-row">
        <div className="w-full md:w-4/5 rounded-md bg-white shadow p-4 ">
          <div className="flex gap-2 pl-3 items-center py-3">
            <div>
              <img
                src="https://res.cloudinary.com/phantom1245/image/upload/v1704135513/farm2home/mdi_delivery-dining-electric-outline_iyhtqp.svg"
                alt="delivery icon"
                loading="lazy"
              />
            </div>
            <div className=" text-black text-[20px] font-medium font-workSans">
              Delivery Method
            </div>
          </div>
          <hr className="py-3" />
          <div className="flex justify-between">
            <div className="">
              <label
                htmlFor="delivery"
                className="text-md my-4 font-medium font-workSans peer-checked/delivery:text-black "
              >
                <input
                  id="delivery"
                  className="peer/delivery mr-2"
                  type="radio"
                  name="status"
                  checked={status === "delivery"}
                  onChange={() => setStatus("delivery")}
                />
                Home Delivery
              </label>
            </div>
            <div>
              <label
                htmlFor="pickup"
                className=" text-md my-4 font-medium font-workSans peer-checked/pickup:text-sky-500"
              >
                <input
                  id="pickup"
                  className="peer/pickup mr-2"
                  type="radio"
                  name="status"
                  checked={status === "pickup"}
                  onChange={() => setStatus("pickup")}
                  disabled
                />
                Pickup Station
              </label>
              <div
                className={
                  status === "pickup" ? "peer-checked/pickup:block" : "hidden"
                }
              >
                Your post will be publicly visible on your site.
              </div>
            </div>
          </div>
          <div
            className={
              status === "delivery" ? "peer-checked/delivery:block  " : "hidden"
            }
          >
            <AddressBook
              handleDeliveryPrice={handleDeliveryPrice}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              existingArray={existingArray}
              setExistingArray={setExistingArray}
            />
          </div>
        </div>

        
        <div className="w-full md:w-1/2 rounded-md bg-white shadow p-4 ">
          <div className="flex border-b border-[#7E7E7E] pt-3 pb-1 justify-between items-center">
            <div className="text-black text-[22px] font-medium font-workSans">
              Order Summary
            </div>
            <div className="pr-2 text-black text-xl font-medium font-workSans tracking-tight">
              {shop?.length > 0 ? <span>({shop?.length})</span> : null} items
            </div>
          </div>
          <div className="mt-5 flex border-b border-[#7E7E7E] pt-3 pb-1 justify-between items-center">
            <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
              SubTotal:
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              {AddCommasToNumber(subtotal)}
            </div>
          </div>
          <div className="mt-5 flex border-b border-[#7E7E7E] pt-3 pb-1 justify-between items-center">
            <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
              Delivery Fee:
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              { AddCommasToNumber(delivery)}
            </div>
          </div>
          <div className="mt-5 flex border-b border-[#7E7E7E] pt-3 pb-1 justify-between items-center">
            <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
              Service Fee:
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              { AddCommasToNumber(serviceCharge)}
            </div>
          </div>
          <div className="mt-5 flex  pt-3 pb-1 justify-between items-center">
            <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
              Total:
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              {!isNaN(total) ? (AddCommasToNumber(total)) : 0}
            </div>
          </div>

          {estimatePrice === null ||
            estimatePrice === undefined ||
            existingArray.length < 1 ||
            shop.length == 0 ||
            loading === true ||
            isNaN(total) ? (
              <>
                <div className="text-mainGreen flex justify-end items-center mt-10 text-xl font-medium font-workSans">
                No Delivery Charges
                </div>{" "}
                <Button
                  className="mt-4 w-full "
                  onClick={() => navigate("/checkout")}
                  disabled
                >
                Checkout
                </Button>{" "}
              </>
            ) : (
              <PaystackCheckout
                total={total}
                email={user?.email}
                selectedAddress={selectedAddress}
              />
            )}
        </div>
      </div>
    </DefaultLayout>
  );
}