import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DefaultLayout from "../../layouts/defaultLayout";
import axiosClient from "../../lib/axiosClient";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Rating,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useAddReviewMutation } from "../../services/api";
import { toast } from "react-toastify";
import AddCommasToNumber from "../../lib/util/addComma";

const Loader = () => {
  return <div>loading</div>;
};

const TABLE_HEAD = ["Name", "Total Quantity", "Price", "Date", "category", ""];
export default function OrderDetails() {
  let { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rated, setRated] = useState(4);
  const [review, setReview] = useState("");
  const [userReview, { isLoading }] = useAddReviewMutation();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchFailed(false);

    axiosClient
      .get(`order/customer/${userId}`)
      .then((response) => {
        const orders = Array.isArray(response?.data) ? response.data : [];
        const match = orders.find((o) => o.orderID === id);
        if (match) {
          setOrderDetails(match);
        } else {
          setFetchFailed(true);
        }
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, userId]);

  const dateObject = new Date(orderDetails?.createdAt);

  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // FIX: guard against items whose product_id is null/undefined
  // (e.g. the referenced product was later deleted). Previously this
  // threw "Cannot read properties of null (reading 'product_price')"
  // during render, which blanked the whole page with no error boundary
  // to catch it.
  const subtotal = orderDetails?.products?.reduce(
    (total, item) =>
      total +
      (item?.product_id?.product_price ?? 0) * (item?.product_quatity ?? 0),
    0,
  );

  const serviceCharges = (subtotal ?? 0) * 0.15;

  // FIX: guard in case subtotal/amount_paid aren't available yet, so we
  // don't propagate NaN into the UI.
  const deliveryCharges =
    subtotal != null
      ? (orderDetails?.amount_paid ?? 0) - subtotal - serviceCharges
      : 0;

  const handleReviewSubmission = () => {
    let postDataInfo = {
      rate: rated,
      comment: review,
    };
    try {
      userReview(postDataInfo).then((res) => {
        if (res.data) {
          toast.success(res?.data?.message || "review submitted");
        }
      });
    } catch (error) {
      // toast.error(error)
    }
    setShowReviewForm(false);
    setRated(0);
  };

  // Order wasn't found in the customer's order list, or we're not logged in
  if (!loading && (fetchFailed || !orderDetails)) {
    return (
      <DefaultLayout>
        <div className="md:px-14 my-4 flex flex-col items-center justify-center py-24 text-center">
          <Typography variant="h5" className="mb-2">
            We couldn&apos;t find this order.
          </Typography>
          <Typography color="gray" className="mb-6 max-w-sm">
            It may have been removed, or there was a problem loading it. Please
            check your orders list and try again.
          </Typography>
          <Button
            className="bg-mainGreen"
            onClick={() => navigate("/my-order")}
          >
            Back to My Orders
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="md:px-14 my-4">
        {loading ? (
          <Loader />
        ) : (
          <Card className="mx-auto px-4">
            <Typography className="text-center text-xl py-4 md:text-2xl font-workSans font-medium text-[#212323]">
              Order Details (
              {["Processing", "Delivered", "Shipped"].includes(
                orderDetails?.status,
              )
                ? orderDetails?.status
                : "Processing"}
              )
            </Typography>
            <div className="md:pl-8 text-mainGreen font-semibold text-md md:mt-4 mb-2">
              Customer&apos;s Details:{" "}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2  md:pl-8 capitalize justify-between w-full">
              <div className="text-black font-medium text-sm ">
                Full name:{" "}
                <span className="inline-flex flex-wrap truncate text-gray-600">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Order No:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.orderID}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                phone No:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {user?.phone_number}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                email:{" "}
                <span className="inline-flex truncate flex-wrap lowercase text-gray-600">
                  {user?.email}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Date:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {formattedDate}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Total Amount Paid:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  &#8358;{AddCommasToNumber(orderDetails?.amount_paid)}
                </span>
              </div>
            </div>
            <div className="md:pl-8 text-mainGreen font-semibold text-md mt-4 mb-2">
              Delivery Details:{" "}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2  md:pl-8 capitalize justify-between w-full">
              <div className="text-black font-medium text-sm ">
                Full name:{" "}
                <span className="inline-flex flex-wrap truncate text-gray-600">
                  {orderDetails?.address?.first_name}{" "}
                  {orderDetails?.address?.last_name}
                </span>
              </div>

              <div className="text-black font-medium text-sm ">
                phone No:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.address?.phone_number}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                email:{" "}
                <span className="inline-flex flex-wrap lowercase truncate text-gray-600">
                  {orderDetails?.address?.email}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Additional phone No:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.address?.additional_phone_number}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Address:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.address?.address}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                state/city:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.address?.state} state,{" "}
                  {orderDetails?.address?.city}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Delivery Code:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.delivery_code}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                Direction:{" "}
                <span className="inline-flex flex-wrap text-gray-600">
                  {orderDetails?.address?.directions}
                </span>
              </div>
            </div>

            <CardBody className="overflow-scroll px-0">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderDetails?.products?.map(
                    ({ product_id, createdAt, product_quatity }, index) => {
                      const isLast = index === orderDetails.products.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";
                      const dateObject = new Date(createdAt);

                      const formattedDate = dateObject.toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      );

                      return (
                        <tr
                          key={index}
                          className="cursor-pointer hover:bg-greenWhite hover"
                        >
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={product_id?.product_image}
                                alt={product_id?.product_name}
                                size="md"
                                className="border border-blue-gray-50 bg-blue-gray-50/50"
                              />
                              <Tooltip
                                content={
                                  product_id?.product_name ??
                                  "Product unavailable"
                                }
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold truncate"
                                >
                                  {product_id?.product_name ??
                                    "Product unavailable"}
                                </Typography>
                              </Tooltip>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {product_quatity}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              &#8358;
                              {AddCommasToNumber(
                                product_id?.product_price ?? 0,
                              )}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {formattedDate}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {product_id?.product_cat}
                            </Typography>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </CardBody>

            <div className="flex justify-end pr-10 my-5">
              <div className="w-full max-w-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#7E7E7E] text-xl font-medium font-workSans">
                    Sub-Total:
                  </span>
                  <span className="text-black text-xl font-medium font-workSans">
                    &#8358;{AddCommasToNumber(subtotal ?? 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#7E7E7E] pb-2">
                  <span className="text-[#7E7E7E] text-xl font-medium font-workSans">
                    Delivery Charges:
                  </span>
                  <span className="text-black text-xl font-medium font-workSans">
                    &#8358;{AddCommasToNumber(deliveryCharges)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#7E7E7E] pb-2">
                  <span className="text-[#7E7E7E] text-xl font-medium font-workSans">
                    Service Charges:
                  </span>
                  <span className="text-black text-xl font-medium font-workSans">
                    &#8358;{AddCommasToNumber(serviceCharges)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#7E7E7E] text-xl font-medium font-workSans">
                    Total:
                  </span>
                  <span className="text-black text-xl font-bold font-workSans">
                    &#8358;{AddCommasToNumber(orderDetails?.amount_paid)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 my-5">
              <Button className="bg-mainGreen w-1/2">reorder</Button>
              <Button
                variant="outlined"
                className="w-1/2"
                onClick={() => setShowReviewForm(true)}
              >
                Review
              </Button>
            </div>
          </Card>
        )}
      </div>
      {showReviewForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white w-[90%] p-8 rounded-md shadow-md max-w-full">
            <h2 className="text-sm font-semibold mb-4">Leave a Review</h2>
            <div className="flex flex-col gap-2 font-bold text-black">
              <Rating value={4} onChange={(value) => setRated(value)} />
              <Typography
                color="blue-gray"
                className="font-medium text-blue-gray-500"
              >
                Based on 134 Reviews
              </Typography>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Review:
              </label>
              <textarea
                className="w-full border rounded-md p-2"
                rows="4"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleReviewSubmission}
                className="bg-mainGreen text-white"
                disabled={isLoading ? true : false}
              >
                Submit
              </Button>
              <Button
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-200 text-gray-700 ml-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
