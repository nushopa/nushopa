import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigations from "../../../components/common/navigations";
import { useResetPasswordMutation } from "../../../services/api";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  let email = localStorage.getItem("forgot-email");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "password" || name === "confirmPassword") {
      setFormData((prevFormData) => {
        if (name === "password" && value.length < 6) {
          setPasswordError("Password must be at least 6 characters");
        } else if (
          name === "confirmPassword" &&
          value !== prevFormData.password
        ) {
          setPasswordError("Passwords do not match");
        } else {
          setPasswordError("");
        }
        return prevFormData;
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const postDataInfo = {
      email: email,
      password: formData.confirmPassword,
    };

    if (passwordError) {
      return;
    }
    try {
      resetPassword(postDataInfo).then((res) => {
        if (res.data) {
          toast.success("Password reset successfully");
          navigate("/sign-in");
        } else {
          return;
        }
      });
    } catch (e) {
      // toast.error(e);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Navigations />
      <div className="w-full flex flex-col md:flex-row justify-between items-center px-4 gap-3 py-10 md:py-0 md:px-20">
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/phantom1245/image/upload/v1711563165/farm2home/bro_cvsmpy.png"
            alt="reset password"
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-1/2">
          <form
            className="bg-white rounded-lg p-4 md:p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold font-workSans">
              Reset Password
            </h2>
            <h5 className="w-full md:w-[70%] text-lg font-semibold font-workSans mb-3">
              Enter a new password to access your account.
            </h5>
            <div className="gap-4 md:gap-5 pt-2">
              <div className="w-full relative">
                <label
                  htmlFor="password"
                  className="text-[#000] font-workSans font-semibold"
                >
                  New Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-11 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </span>
              </div>
              <div className="w-full relative">
                <label
                  htmlFor="confirmPassword"
                  className="text-[#000] font-workSans font-semibold"
                >
                  Confirm Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-11 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4"
              disabled={isLoading ? true : false} // Disable the button while isLoading
            >
              {isLoading ? "Proceeding..." : "Proceed"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
