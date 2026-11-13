import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Auth from "./component/Auths";
import { InputField } from "./component/InputField";

const CUSTOMER_ROLE = 2001;

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

      // Web: backend already set the httpOnly access-token cookie via
      // Set-Cookie. We only keep the user object, and only in Redux.
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
      </form>
    </Auth>
  );
};

export default UserSignIn;
