import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import Auth from "./component/Auths";

export default function UpdatePhoneNumber() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    let postDataInfo = localStorage.getItem("postData");

    // Parse postDataInfo if it's not null or undefined
    if (postDataInfo) {
      postDataInfo = JSON.parse(postDataInfo);

      // Update the postDataInfo object with phoneNumber
      postDataInfo.phone_number = formData.phoneNumber;

      // Convert postDataInfo back to a JSON string before storing it in localStorage
      localStorage.setItem("postData", JSON.stringify(postDataInfo));
    }
    try {
      createUser(postDataInfo).then((res) => {
        if (res.data) {
          localStorage.setItem("userId", res.data.data._id);
          dispatch(addUser(res.data.data));
          toast.success("Account created successfully");
          navigate("/dashboard");
        } else if (res.error.status === 401) {
          // toast.error(res.error.data.message);
          navigate("/sign-in");
          return;
        } else if (res.error) {
          // toast.error(res.error.data.message);
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
      <div className="w-full flex flex-col md:flex-row justify-between items-center px-4 gap-3 py-10 md:py-0 md:px-20">
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/phantom1245/image/upload/v1711563198/farm2home/bro_mlbgnu.png"
            alt="forgotten password"
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-1/2">
          <form
            className="bg-white rounded-lg p-4 md:p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold font-workSans">
              Update Phone number
            </h2>
            <h5 className="w-full md:w-[70%] text-lg font-semibold font-workSans mb-3">
              Enter the phone number associated with your account
            </h5>
            <div className=" gap-4 md:gap-5 pt-2">
              <div className="w-full">
                <label
                  htmlFor="phone number"
                  className="text-[#000] font-workSans font-semibold"
                >
                  Phone Number:
                </label>
                <input
                  type="number"
                  id="phone number"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your Phone Number"
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
        </div>
      </div>
    </Auth>
  );
}
