import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInitializePaymentMutation } from "../../services/api";

const PaystackCheckout = ({ email, address }) => {
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [initializePayment] = useInitializePaymentMutation();
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startTransaction = () => {
    setLoading(true);
    setError(null);
    initializePayment({
      customer_id: userId,
      address,
      email,
    })
      .unwrap()
      .then((data) => setTxn(data))
      .catch((err) => {
        console.error("initializePayment error:", err);
        setError("Could not start checkout. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userId && address && email) {
      startTransaction();
    } else {
      setLoading(false);
      setError("Missing checkout details. Please select an address.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, address, email]);

  const goToStatus = () => {
    if (txn?.reference) {
      navigate(`/order-status/${txn.reference}`);
    } else {
      toast.error("Something went wrong starting your payment.");
    }
  };

  if (error) {
    return (
      <button
        onClick={startTransaction}
        className="mt-4 w-full h-11 rounded-md text-sm font-semibold bg-red-600 text-white"
      >
        {error} — Tap to retry
      </button>
    );
  }

  if (loading || !txn) {
    return (
      <button
        disabled
        className="mt-4 w-full h-11 rounded-md text-sm font-semibold bg-black text-white opacity-60 cursor-not-allowed"
      >
        Preparing checkout…
      </button>
    );
  }

  const nairaSymbol = String.fromCharCode(8358);

  const componentProps = {
    email,
    amount: txn.amount * 100,
    reference: txn.reference,
    publicKey,
    text: (
      <span
        dangerouslySetInnerHTML={{
          __html: `Proceed To Pay ${nairaSymbol}${txn.amount.toLocaleString()}`,
        }}
      />
    ),
    className:
      "bg-black text-white h-11 rounded-md text-sm font-semibold mt-4 w-full",
    onSuccess: goToStatus,
    onClose: goToStatus,
  };

  return <PaystackButton {...componentProps} />;
};

export default PaystackCheckout;