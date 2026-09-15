import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import OTPInput from "../../components/atoms/otpInput/otpInput";
import {
  useVerifyRegistrationOTPMutation,
  useResendRegistrationOTPMutation,
} from "../../services/api";
import { addUser } from "../../redux/user";
import Auth from "./component/Auths";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Email travels via router navigation state from the signup screen —
  // never persisted to localStorage.
  const email = location.state?.email;

  const [otpCode, setOtpCode] = useState("");
  const [verifyOTP, { isLoading }] = useVerifyRegistrationOTPMutation();
  const [resendOTP, { isLoading: isResending }] =
    useResendRegistrationOTPMutation();

  useEffect(() => {
    if (!email) {
      navigate("/sign-up", { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = () => {
    if (!otpCode || isLoading) return;

    verifyOTP({ email, otp: otpCode })
      .unwrap()
      .then((res) => {
        // Backend created the Customer and set the httpOnly cookie already.
        dispatch(addUser(res.data));
        toast.success("Account created successfully!");
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Invalid or expired OTP");
      });
  };

  const handleResend = () => {
    if (isResending) return;
    resendOTP({ email })
      .unwrap()
      .then(() => toast.success("New OTP sent to your email."))
      .catch((err) =>
        toast.error(err?.data?.message || "Could not resend OTP"),
      );
  };

  if (!email) return null;

  return (
    <Auth title="" subtitle="" buttonText="" buttonPath="" formSide="center">
      <div className="w-full md:w-[100%] mx-auto bg-white rounded-lg p-4 md:p-14">
        <div className="text-md md:text-lg mx-auto text-center text-[#212323] flex justify-center items-center font-workSans font-semibold">
          Enter the 6 digit code sent to your email address ({email})
        </div>

        <OTPInput setOtpCode={setOtpCode} />

        <div>
          <Button
            fullWidth
            className="my-4 bg-mainGreen"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-mainGreen text-sm font-medium mx-auto block"
        >
          {isResending ? "Resending..." : "Resend code"}
        </button>
      </div>
    </Auth>
  );
};

export default OTPVerification;