import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../layouts/defaultLayout";
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
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rated, setRated] = useState(4);
  const [review, setReview] = useState("");
  const [userReview, { isLoading }] = useAddReviewMutation();
  let baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}order/${id}`)
      .then((response) => {
        if (response.data) {
          setOrderDetails(response?.data?.orders[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, id]);
  const dateObject = new Date(orderDetails?.createdAt);

  // Format the date as YYYY-MM-DD
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Calculate subtotal
  const subtotal = orderDetails?.products?.reduce(
    (total, item) =>
      total + item.product_id.product_price * item.product_quatity,
    0
  );

  // Calculate delivery charges
  const deliveryCharges = orderDetails?.amount_paid - subtotal;
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
                orderDetails?.status
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
                  {orderDetails?.customer_id.first_name +
                    " " +
                    orderDetails?.customer_id.last_name}
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
                  {orderDetails?.customer_id.phone_number}
                </span>
              </div>
              <div className="text-black font-medium text-sm ">
                email:{" "}
                <span className="inline-flex truncate flex-wrap lowercase text-gray-600">
                  {orderDetails?.customer_id.email}
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
                  {orderDetails?.address.first_name +
                    " " +
                    orderDetails?.address.last_name}
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
                  { orderDetails?.address?.email}
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
                  {orderDetails?.address.state} state,{" "}
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

                      // Format the date as YYYY-MM-DD
                      const formattedDate = dateObject.toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
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
                              <Tooltip content={product_id?.product_name}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold truncate"
                                >
                                  {product_id?.product_name }
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
                              {AddCommasToNumber(product_id?.product_price)}
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
                    }
                  )}
                </tbody>
              </table>
            </CardBody>

            <div className="flex flex-col justify-end items-end pr-10 my-5">
              <div className="flex gap-9">
                <div className="flex justify-start items-start text-[#7E7E7E] text-[20px] font-medium font-workSans">
                  Sub-Total:
                </div>
                <div className="text-black text-xl font-medium font-workSans">
                  &#8358;
                  {AddCommasToNumber(
                    orderDetails?.products?.reduce(
                      (total, item) =>
                        total +
                        item.product_id.product_price * item.product_quatity,
                      0
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-9 border-b border-[#7E7E7E] pb-2">
                <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
                  Delivery Charges:
                </div>
                <div className="text-black text-xl font-medium font-workSans">
                  &#8358;{AddCommasToNumber(deliveryCharges)}
                </div>
              </div>
              <div className="flex gap-9">
                <div className="text-[#7E7E7E] text-[20px] font-medium font-workSans">
                  Total:
                </div>
                <div className="text-black text-xl font-medium font-workSans">
                  &#8358;
                  {AddCommasToNumber(orderDetails?.amount_paid)}
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
            {/* Rating Bar */}
            <div className="flex flex-col gap-2 font-bold text-black">
              <Rating value={4} onChange={(value) => setRated(value)} />
              <Typography
                color="blue-gray"
                className="font-medium text-blue-gray-500"
              >
                Based on 134 Reviews
              </Typography>
            </div>
            {/* Review Textarea */}
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
            {/* Submit Button */}
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
