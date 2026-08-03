import { useState, useRef } from "react";

const OTPInput = ({ setOtpCode }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input box
    if (value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    const otpCode = newOtp.join(""); // Concatenate the OTP digits
    setOtpCode(otpCode);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      // If backspace is pressed and the current box is empty, move to the previous box
      inputRefs.current[index - 1].focus();
    }
  
    if (event.key === "Tab") {
      // Prevent default tab behavior if the current box is empty
      if (!otp[index]) {
        event.preventDefault();
      } else if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  
  return (
    <div className="flex justify-center items-center mt-4 md:mt-8">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="border border-[#212323] rounded-lg w-10 h-10 md:w-12 md:h-12 mx-1 md:mx-2 text-center text-xl focus:outline-none"
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(input) => (inputRefs.current[index] = input)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
