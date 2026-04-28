import { PaystackButton } from 'react-paystack';
import { toast } from 'react-toastify';
import { useAddOrderMutation } from '../../services/api';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/cart';

const PaystackCheckout = ({ total, email, selectedAddress }) => {
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  let amount = total * 100;
  let userId = localStorage.getItem("userId");
  const [docId, setDocId] = useState([]);
  const [addOderID] = useAddOrderMutation();
  let navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  let baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    let userId = localStorage.getItem("userId");

    axios
      .get(`${baseUrl}cart/get/${userId}`)
      .then((response) => {
        if (response.data) {
          setCart(response.data.cart);
        }
      })
      .finally(() => {
        setLoading(false); 
      });

    axios
      .get(`${baseUrl}checkout/address/${userId}`)
      .then((response) => {
        if (response.data.checkout) {
          setDocId(response.data.checkout);
        }
      })
      .finally(() => {
        setLoading(false);
      });
      
    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
    if (pendingOrder) {
      processOrder(pendingOrder);
    }
  }, [baseUrl]);

  const selected = docId[selectedAddress];

  const processOrder = async (postData) => {
    try {
      setIsProcessing(true);
      const response = await addOderID({ data: postData });
      if (response.data) {
        localStorage.removeItem("pendingOrder");
        dispatch(clearCart());
        toast.success("Payment was successfully approved!");
        navigate("/my-order");
      }
    } catch (error) {
      toast.error("Error processing order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackSuccessAction = (reference) => {
    if (!cart || cart.length < 1) {
      alert("Add some items");
      return;
    }

    let postData = {
      orderID: reference.reference,
      products: cart,
      address: selected,
      customer_id: userId,
      amount_paid: total,
    };

    if (reference.message === "Approved") {
      localStorage.setItem("pendingOrder", JSON.stringify(postData));
      processOrder(postData);
    } else {
      toast.error("Payment was not approved.");
    }
  };

  const nairaSymbol = String.fromCharCode(8358);

  const componentProps = {
    email,
    amount,
    publicKey,
    text: <span dangerouslySetInnerHTML={{ __html: `Proceed To Pay ${nairaSymbol}${total}` }} />,
    className: "bg-black text-white h-11 rounded-md text-sm font-semibold mt-4 w-full",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: () => alert('Payment canceled by user.'),
    disabled: loading || isProcessing,
  };

  return (
    <>
      <PaystackButton {...componentProps} />
      {(loading || isProcessing) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Processing your order, please wait...</p>
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaystackCheckout;
