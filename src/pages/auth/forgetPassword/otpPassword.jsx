import { Button } from "@material-tailwind/react";
import OTPInput from "../../../components/atoms/otpInput/otpInput";
import { useEffect, useState } from "react";
import { useVerifyOTPMutation } from "../../../services/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../component/Auths";

export default function OtpPassword() {
  const [otpCode, setOtpCode] = useState("");
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgotten-password", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = () => {
    const postDataInfo = { email, code: otpCode };

    try {
      verifyOTP(postDataInfo).then((res) => {
        if (res.data) {
          toast.success("successful");
          navigate("/reset-password", { state: { email } });
        } else {
          toast.error(res.error?.data?.message || "Invalid code");
        }
      });
    } catch (e) {
      // toast.error(e);
    }
  };

  if (!email) return null;

  return (
    <Auth title="" subtitle="" buttonText="" buttonPath="" formSide="center">
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
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Auth>
  );
}