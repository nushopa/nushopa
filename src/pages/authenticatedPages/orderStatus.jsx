import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/defaultLayout";
import { useGetOrderStatusQuery } from "../../services/api";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../redux/cart";

const MAX_ATTEMPTS = 20; // ~1 minute at 3s intervals

export default function OrderStatus() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attempts, setAttempts] = useState(0);

  const { data, error } = useGetOrderStatusQuery(reference, {
    pollingInterval: 3000,
    skip: !reference || attempts >= MAX_ATTEMPTS,
  });

  useEffect(() => {
    if (!data) return;

    if (data.status === "fulfilled" && data.order) {
      dispatch(setCartCount(0));
      navigate(`/order/${data.order.orderID}`);
    } else if (data.status === "pending") {
      setAttempts((a) => a + 1);
    }}, [data, dispatch, navigate]);

  const hasFailed =
    !!error ||
    data?.status === "failed" ||
    data?.status === "not_found" ||
    attempts >= MAX_ATTEMPTS;

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        {!hasFailed ? (
          <>
            <span className="cartLoader mb-4" />
            <h2 className="text-lg font-semibold text-black">
              Confirming your payment…
            </h2>
            <p className="text-gray-500 mt-2 max-w-sm">
              If you paid by bank transfer or USSD this can take a minute.
              Please don&apos;t close this page.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-red-600">
              We couldn&apos;t confirm your payment.
            </h2>
            <p className="text-gray-500 mt-2 max-w-sm">
              Your cart has been kept as-is. If you were debited, contact
              support with reference{" "}
              <span className="font-mono text-black">{reference}</span>.
              Otherwise, you can return to checkout and try again.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 bg-mainGreen text-white px-6 py-2 rounded-md text-sm font-semibold"
            >
              Back to Checkout
            </button>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}