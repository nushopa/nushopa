import { Button } from "@material-tailwind/react";
import OTPInput from "../../../components/atoms/otpInput/otpInput";
import { useState } from "react";
import { useVerifyOTPMutation } from "../../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Auth from "../component/Auths";

export default function OtpPassword() {
  const [otpCode, setOtpCode] = useState("");
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  let email = localStorage.getItem("forgot-email");
  const navigate = useNavigate();
  const handleSubmit = () => {
    const postDataInfo = {
      email: email,
      code: otpCode,
    };

    try {
      verifyOTP(postDataInfo).then((res) => {
        if (res.data) {
          toast.success("successful");
          navigate("/reset-password");
        } else {
          toast.error(res.error.data.message);
          // toast.error("Invalid OTP code ");
          return;
        }
      });
    } catch (e) {
      // toast.error(e);
    }
  };

  return (
    <Auth
      title=""
      subtitle=""
      buttonText=""
      buttonPath=""
      formSide="center"
    >
      <div className="w-full md:w-[100%] mx-auto bg-white rounded-lg p-4 md:p-14">
        <div className="text-md md:text-lg mx-auto text-center text-[#212323] flex justify-center items-center font-workSans font-semibold">
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
    </Auth>
  );
}
