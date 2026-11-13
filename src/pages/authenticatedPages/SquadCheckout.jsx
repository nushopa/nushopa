import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useInitializePaymentMutation } from "../../services/api";

const SquadCheckout = ({ email, address, userId, deliveryQuoteId }) => {
  const [initializePayment] = useInitializePaymentMutation();
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startedFor = useRef(null);

  const startTransaction = () => {
    setLoading(true);
    setError(null);
    setTxn(null);
    initializePayment({
      customer_id: userId,
      address,
      delivery_quote_id: deliveryQuoteId,
      email,
      platform: "web",
    })
      .unwrap()
      .then((data) => setTxn(data))
      .catch((err) => {
        console.error("initializePayment error:", err);
        // Show the server's message when it gave one (e.g. expired quote)
        setError(
          err?.data?.message || "Could not start checkout. Please try again.",
        );
        // Allow the effect or retry button to start a fresh attempt
        startedFor.current = null;
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userId && address && email && deliveryQuoteId) {
      if (startedFor.current === deliveryQuoteId) return; // already started
      startedFor.current = deliveryQuoteId;
      startTransaction();
    } else {
      startedFor.current = null;
      setTxn(null);
      setLoading(false);
      setError(
        "Missing checkout details. Please select an address and delivery option.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, address, email, deliveryQuoteId]);

  const handleRetry = () => {
    startedFor.current = deliveryQuoteId;
    startTransaction();
  };

  const goToCheckout = () => {
    if (txn?.checkout_url) {
      window.location.href = txn.checkout_url;
    } else {
      toast.error("Something went wrong starting your payment.");
    }
  };

  if (error) {
    return (
      <button
        onClick={handleRetry}
        className="mt-4 w-full min-h-11 rounded-md px-3 py-2 text-sm font-semibold bg-red-600 text-white"
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

  return (
    <button
      onClick={goToCheckout}
      className="bg-black text-white h-11 rounded-md text-sm font-semibold mt-4 w-full"
    >
      {`Proceed To Pay ${nairaSymbol}${txn.amount.toLocaleString()}`}
    </button>
  );
};

export default SquadCheckout;
