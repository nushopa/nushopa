import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../services/api";
import { toast } from "react-toastify";

import Auth from "./component/Auths";
import { InputField } from "./component/InputField";

const CUSTOMER_ROLE = 2001;

const redirectToGoogleAuth = () => {
  const backendUrl = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
  window.location.href = `${backendUrl}/auth/google?platform=web`;
};

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.trim() || "",
    }));

    // Password validation
    if (name === "password" || name === "confirmPassword") {
      if (name === "password" && value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else if (name === "confirmPassword" && value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordError || isLoading) return;

    const postDataInfo = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.confirmPassword,
      phone_number: formData.phoneNumber,
      role: CUSTOMER_ROLE
    };

    createUser(postDataInfo)
      .then((res) => {
        if (res.data) {
          localStorage.setItem("pendingVerificationEmail", formData.email);
          toast.success(
            "OTP sent to your email. Please verify to complete registration.",
          );
          navigate("/verify-otp");
        } else {
          toast.error(res.error?.data?.message || "Registration failed");
        }
      })
      .catch(() => {
        toast.error("An error occurred during registration");
      });
  };

  return (
    <Auth
      title="Experience the the modern way to shop"
      subtitle="Please provide your information to continue shopping with Us."
      buttonText="Login"
      buttonPath="/sign-in"
      formSide="right"
    >
      <form className="bg-white rounded-lg" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-5 py-2">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />

          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div className="py-2">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="py-2">
          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel" // Better than type="number"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your Phone Number"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5 py-2">
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            required
            error={passwordError}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your Password"
            required
            error={passwordError}
          />
        </div>

        <div className="text-[#121212/50] font-workSans text-[12px]">
          By creating an account, you agree to Farm2Home{" "}
          <a href="/terms-and-conditions" className="text-mainGreen">
            Terms & Conditions
          </a>
        </div>

        <button
          type="submit"
          className="bg-mainGreen w-full text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Sending OTP..." : "Create an Account"}
        </button>

        {/* Divider */}
        <div className="relative flex w-[90%] mx-auto flex-row py-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 my-auto" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 my-auto" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={redirectToGoogleAuth}
            className="cursor-pointer"
            aria-label="Sign up with Google"
          >
            <img
              className="w-12"
              src="https://res.cloudinary.com/phantom1245/image/upload/v1702037705/farm2home/Frame_268_fpbpmd.png"
              alt="google icon"
            />
          </button>
          <div>
            <a href="/">
              <img
                className="w-12"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037689/farm2home/Frame_267_queazd.png"
                alt="facebook icon"
              />
            </a>
          </div>
        </div>
      </form>
    </Auth>
  );
};

export default UserSignUp;