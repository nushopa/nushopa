import { useState, useEffect } from "react";
import { StepperWithContent } from "../../components/atoms/stepper/stepper";
import DefaultLayout from "../../layouts/defaultLayout";
import AddressBook from "../../components/molecule/addressBook/addressBook";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import axiosClient from "../../lib/axiosClient";
import { Helmet } from "react-helmet-async";
import AddCommasToNumber from "../../lib/util/addComma";
import SquadCheckout from "./SquadCheckout";

const SERVICE_CHARGE_RATE = 0.15;

export default function Checkout() {
  const [status, setStatus] = useState("delivery");
  const [existingArray, setExistingArray] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState("standard");
  const [deliveryOptions, setDeliveryOptions] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteRefreshKey, setQuoteRefreshKey] = useState(0);
  const [shop, setShop] = useState([]);
  let navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const addressResponse = await axiosClient.get(
          `checkout/address/${userId}`,
        );
        if (addressResponse.data.checkout) {
          setExistingArray(addressResponse.data.checkout);
        }

        const cartResponse = await axiosClient.get(`cart/get/${userId}`);
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

  const subtotal = shop?.reduce(
    (total, item) =>
      total + item.product_id.product_price * item.product_quatity,
    0,
  );

  const delivery = deliveryOptions?.[deliveryMode]?.deliveryFee ?? 0;
  const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE);
  const total = subtotal + delivery + serviceCharge;

  const resolvedAddress =
    selectedAddress !== null ? existingArray[selectedAddress] : null;
  const selectedQuote = deliveryOptions?.[deliveryMode];

  useEffect(() => {
    if (!userId || !resolvedAddress) {
      setDeliveryOptions(null);
      setQuoteError("");
      setQuoteLoading(false);
      setDeliveryMode("standard");
      return;
    }

    let cancelled = false;
    setDeliveryOptions(null);
    setQuoteError("");
    setQuoteLoading(true);

    axiosClient
      .post("checkout/delivery-options", {
        customer_id: userId,
        address: resolvedAddress,
      })
      .then(({ data }) => {
        if (cancelled) return;
        const options = data?.options ?? null;
        setDeliveryOptions(options);
        setDeliveryMode((current) =>
          current === "fast" && !options?.fast?.available
            ? "standard"
            : current,
        );
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Could not load delivery quotes:", error);
        setQuoteError(
          error.response?.data?.message || "Could not load delivery prices.",
        );
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, resolvedAddress, quoteRefreshKey]);

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
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              existingArray={existingArray}
              setExistingArray={setExistingArray}
            />
            {resolvedAddress && (
              <div className="mt-6 rounded-md border border-gray-200 p-4">
                <div className="mb-3 font-medium">Delivery speed</div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="standard"
                      checked={deliveryMode === "standard"}
                      onChange={() => setDeliveryMode("standard")}
                      disabled={quoteLoading || !deliveryOptions?.standard}
                    />
                    <span>Standard delivery</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="fast"
                      checked={deliveryMode === "fast"}
                      onChange={() => setDeliveryMode("fast")}
                      disabled={
                        quoteLoading || !deliveryOptions?.fast?.available
                      }
                    />
                    <span>Fast delivery</span>
                  </label>
                </div>
                {quoteLoading && (
                  <p className="mt-2 text-sm text-gray-600">
                    Getting delivery prices…
                  </p>
                )}
                {quoteError && (
                  <div className="mt-2 text-sm text-red-700">
                    <p>{quoteError}</p>
                    <button
                      type="button"
                      className="mt-1 underline"
                      onClick={() => setQuoteRefreshKey((key) => key + 1)}
                    >
                      Retry
                    </button>
                  </div>
                )}
                {!quoteLoading &&
                  !quoteError &&
                  deliveryOptions?.fast?.message && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>{deliveryOptions.fast.message}</p>
                      {deliveryOptions.fast.message.includes(
                        "temporarily unavailable",
                      ) && (
                        <button
                          type="button"
                          className="mt-1 underline"
                          onClick={() => setQuoteRefreshKey((key) => key + 1)}
                        >
                          Retry fast delivery quote
                        </button>
                      )}
                    </div>
                  )}
              </div>
            )}
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
              {deliveryMode === "fast"
                ? "Fast delivery fee:"
                : "Standard delivery fee:"}
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              {AddCommasToNumber(delivery)}
            </div>
          </div>
          <div className="mt-5 flex border-b border-[#7E7E7E] pt-3 pb-1 justify-between items-center">
            <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
              Service Fee:
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              {AddCommasToNumber(serviceCharge)}
            </div>
          </div>
          <div className="mt-5 flex  pt-3 pb-1 justify-between items-center">
            <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
              Total:
            </div>
            <div className="text-black text-xl font-medium font-workSans">
              &#8358;
              {!isNaN(total) ? AddCommasToNumber(total) : 0}
            </div>
          </div>

          {delivery === null ||
          delivery === undefined ||
          !selectedQuote?.quoteId ||
          existingArray.length < 1 ||
          shop.length == 0 ||
          loading === true ||
          quoteLoading ||
          isNaN(total) ? (
            <Button
              className="mt-4 w-full "
              onClick={() => navigate("/checkout")}
              disabled
            >
              Checkout
            </Button>
          ) : (
            <SquadCheckout
              email={user?.email}
              address={resolvedAddress}
              userId={userId}
              deliveryQuoteId={selectedQuote.quoteId}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
