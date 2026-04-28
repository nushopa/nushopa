import { Button } from "@material-tailwind/react";
import OTPInput from "../../../components/atoms/otpInput/otpInput";
import AuthLayout from "../../../layouts/authLayout";
import { useState } from "react";
import { useVerifyOTPMutation } from "../../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function OtpPassword() {
  const [otpCode, setOtpCode] = useState(""); // State to store the OTP code
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  let email = localStorage.getItem("forgot-email");
  const navigate = useNavigate();
  const handleSubmit = () => {
    const postDataInfo = {
      email: email,
      code: otpCode,
    };

    try {
      verifyOTP(postDataInfo)
        .then((res) => {
          if (res.data) {
            toast.success("successful");
            navigate("/reset-password");
          } else {
            toast.error(res.error.data.message)
            // toast.error("Invalid OTP code ");
            return;
          }
        })
    } catch (e) {
      // toast.error(e);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full md:w-[80%] mx-auto bg-white rounded-lg p-4 md:p-14">
        <div className="text-md md:text-xl mx-auto text-center text-[#212323] flex justify-center items-center font-workSans font-semibold">
          Enter the 6 digits code sent to your email address ({email})
        </div>
        <OTPInput setOtpCode={setOtpCode} />
        <div>
          <Button
            fullWidth
            className="my-6 bg-mainGreen "
            onClick={handleSubmit}
            disabled={isLoading ? true : false}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
