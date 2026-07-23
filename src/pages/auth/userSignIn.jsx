import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Auth from "./component/Auths";
import { InputField } from "./component/InputField";

const CUSTOMER_ROLE = 2001;

const redirectToGoogleAuth = () => {
  const backendUrl = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
  window.location.href = `${backendUrl}/auth/google`;
};

const UserSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || isLoading) return;

    const postDataInfo = {
      email: formData.email,
      password: formData.password,
      role: CUSTOMER_ROLE,
    };

    try {
      const res = await loginUser(postDataInfo).unwrap();

      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user._id);

      if (res.user?.profile_picture) {
        localStorage.setItem("profile-picture", res.user.profile_picture);
      }

      dispatch(addUser(res.user));
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Auth
      title="Welcome Back"
      subtitle="Don't have an account click to create an account with us today."
      buttonText="Sign Up"
      buttonPath="/sign-up"
      formSide="left"
    >
      <form className="bg-white rounded-lg " onSubmit={handleSubmit}>
        <div className="space-y-5 pt-2">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            required
            error={passwordError}
            className="w-full"
          />
        </div>

        <div className="font-workSans font-normal text-[16px] py-3">
          <a href="/forgotten-password" className="text-mainGreen">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
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
            aria-label="Sign in with Google"
          >
            <img
              className="w-12"
              src="https://res.cloudinary.com/phantom1245/image/upload/v1702037705/farm2home/Frame_268_fpbpmd.png"
              alt="google icon"
              loading="lazy"
            />
          </button>
          <div>
            <a href="/">
              <img
                className="w-12"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037689/farm2home/Frame_267_queazd.png"
                alt="facebook icon"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </form>
    </Auth>
  );
};

export default UserSignIn;