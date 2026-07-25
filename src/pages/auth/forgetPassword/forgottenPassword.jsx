import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgottenPasswordMutation } from "../../../services/api";
import { toast } from "react-toastify";
import Auth from "../component/Auths";

export default function ForgottenPassword() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgottenPassword, { isLoading }] = useForgottenPasswordMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const postDataInfo = {
      email: formData.email,
    };

    try {
      forgottenPassword(postDataInfo).then((res) => {
        if (res.data) {
          localStorage.setItem("forgot-email", postDataInfo.email);
          toast.success("Email sent successfully");
          navigate("/otp-password");
        } else {
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
      buttonText="Login"
      buttonPath="/sign-in"
      formSide="center"
    >
      <form className="bg-white rounded-lg  " onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold font-workSans">
          Forgot Password?
        </h2>
        <h5 className="w-full md:w-[100%] text-md  mb-3">
          Enter the email address associated with your account
        </h5>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-[#000] font-workSans font-semibold"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4"
          disabled={isLoading ? true : false} // Disable the button while isLoading
        >
          {isLoading ? "Proceeding..." : "Proceed"}
        </button>
      </form>
    </Auth>
  );
}
