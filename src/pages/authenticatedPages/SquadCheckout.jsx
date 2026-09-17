import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useInitializePaymentMutation } from "../../services/api";

const SquadCheckout = ({ email, address, userId }) => {
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
      platform: "web",
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