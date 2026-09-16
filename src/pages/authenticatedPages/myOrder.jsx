import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DefaultLayout from "../../layouts/defaultLayout";
import axiosClient from "../../lib/axiosClient";
import { Avatar, Button, Chip } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { StepperWithContent } from "../../components/atoms/stepper/stepper";
import { Helmet } from "react-helmet-async";

const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center pt-24">
      <span className="cartLoader"></span>
    </div>
  );
};

export default function MyOrder() {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const [activeStep, setActiveStep] = useState(2);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    axiosClient
      .get(`order/customer/${userId}`)
      .then((response) => {
        if (response.data) {
          setOrder(response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  function getStatusColor(status) {
    switch (status) {
    case "Delivered":
      return "mainGreen";
    case "Processing":
      return "mainOrange";
    default:
      return "shipped";
    }
  }

  return (
    <DefaultLayout>
      <Helmet>
        <title>Nushopa | My Orders</title>
        <meta
          name="description"
          content="Track and manage your orders with ease on Nushopa's My Orders page. Stay updated on the status of your current orders and access details of your past purchases. Experience convenience and transparency in your farm-to-table journey by keeping tabs on your orders right from your fingertips!"
        />
      </Helmet>

      <div className="mx-auto">
        <Button
          onClick={() => navigate("/")}
          className="my-6 rounded-[10px] border bg-transparent border-mainGreen justify-start items-center gap-2 inline-flex"
        >
          <ArrowLeftIcon className="w-6 h-6 text-mainGreen" />
          <div className="text-mainGreen text-sm font-medium font-workSans">
            Continue Shopping
          </div>
        </Button>
        <div className="mb-20">
          <StepperWithContent
            activeStep={activeStep}
            setActiveStep={(step) => setActiveStep(step)}
          />
        </div>
        {loading && <Loader />}
        {order
          ?.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          ?.map((item, index) => (
            <div
              className="w-full flex flex-col md:flex-row shadow justify-between px-9 pt-5 md:py-4 items-center my-5 bg-white md:my-10 gap-4 rounded-md"
              key={index}
              onClick={() => navigate(`/order/${item.orderID}`)}
            >
              <div className="flex items-center -space-x-24 ">
                {item.products.map((image, index) => (
                  <Avatar
                    variant="circular"
                    key={index}
                    alt="user 1"
                    size="xxl"
                    className="border-2 border-mainGreen hover:z-10 focus:z-10"
                    src={image.product_id.product_image}
                  />
                ))}
              </div>

              <div className="pt-3">
                <div className="flex gap-2">
                  <div className="text-mainGreen font-workSans">
                    {item.orderID}.
                  </div>
                  <div>{item.address.city}</div>
                </div>
                <div className="font-semibold py-1 font-roboto">
                  {item.address.address}
                </div>
                {item.createdAt && (
                  <div className="flex gap-3 items-center">
                    <div className="font-roboto font-medium text-base text-gray-900 ">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>

                    <div className="font-roboto font-medium text-base text-gray-900 ">
                      {new Date(item.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </div>
                )}
                <div className="hidden md:flex">
                  {/*
                    Was <a href=""> — an empty href forces a hard,
                    full-page navigation to the current URL. On a
                    protected route that reloads Redux from scratch
                    (the user slice is deliberately excluded from
                    redux-persist), so isLoggedIn/user briefly reset
                    to false until SessionBootstrap's /profile call
                    resolves. ProtectedRoute does guard on
                    `sessionChecked`, so this shouldn't by itself log
                    you out permanently — but it's still a real bug:
                    it discards client-side routing, refetches
                    everything on this page from zero, and is a
                    plausible contributor to the flash-to-login you're
                    seeing. Using Link keeps navigation client-side and
                    removes that reload entirely. `stopPropagation` is
                    needed because the parent row already navigates
                    on click, to `/order/:orderID` — same destination
                    here, so this is mostly redundant with the row
                    click, but kept as an explicit affordance.
                  */}
                  <Link
                    to={`/order/${item.orderID}`}
                    onClick={(e) => e.stopPropagation()}
                    className="underline text-mainGreen"
                  >
                    view order
                  </Link>
                </div>
              </div>
              <div>
                <Chip
                  size="lg"
                  value={item.status}
                  className={`bg-shipped bg-${getStatusColor(item.status)}`}
                />
              </div>
              <div className="md:flex hidden flex-col gap-3 ">
                <Button
                  className="bg-mainGreen w-[14rem]"
                  disabled={item.status !== "Delivered"}
                >
                  reorder
                </Button>
                <Button variant="outlined" disabled>
                  Review
                </Button>
              </div>
            </div>
          ))}
      </div>
    </DefaultLayout>
  );
}