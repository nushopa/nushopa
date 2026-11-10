import { useState, useEffect } from "react";
import { Textarea } from "@material-tailwind/react";
import NaijaStates from "naija-state-local-government";
import { Select, Option } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosClient from "../../../lib/axiosClient";

export default function Delivery({ onDeliveryPriceChange, onAddressAdded }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    AdditionalPhoneNumber: "",
    address: "",
    directions: "",
  });
  const [selectedOption, setSelectedOption] = useState("Lagos");
  const [selectedLga, setSelectedLga] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;

  useEffect(() => {
    axiosClient
      .get("pricelist")
      .then((response) => {
        if (response.data) {
          setDeliveryPrices(response.data.prices ?? []);
        }
      })
      .catch((error) => {
        console.error("Could not load delivery areas:", error);
        toast.error(
          error.response?.data?.message || "Could not load delivery areas.",
        );
      })
      .finally(() => {
        setDeliveryLoading(false);
      });
  }, []);

  useEffect(() => {
    if (deliveryPrices.length > 0) {
      setSelectedLga(deliveryPrices[0].city);
    }
  }, [deliveryPrices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (newOption) => {
    setSelectedOption(newOption);
  };
  const handleSelectLga = (e) => {
    setSelectedLga(e.target.value);
  };
  const handleChangeTextarea = (e, field) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (deliveryLoading) return;
    const estimatePrice = deliveryPrices.find(
      (cityObj) => cityObj.city === selectedLga,
    )?.estimatePrice;
    onDeliveryPriceChange(estimatePrice);
  }, [selectedLga, onDeliveryPriceChange, deliveryPrices, deliveryLoading]);

  if (deliveryLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    if (!deliveryPrices.some((price) => price.city === selectedLga)) {
      toast.error("Please select a valid delivery area.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosClient.post("checkout/price", {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone_number: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        state: selectedOption,
        city: selectedLga,
        additional_phone_number: formData.AdditionalPhoneNumber.trim(),
        directions: formData.directions.trim(),
        customer_id: userId,
      });

      onDeliveryPriceChange(data.price ?? data.estimatePrice);
      const refreshed = await onAddressAdded();
      if (!refreshed) return;
      toast.success("Delivery address saved.");
    } catch (error) {
      console.error("Could not save delivery address:", error);
      toast.error(
        error.response?.data?.message || "Could not save delivery address.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const lgas = NaijaStates.lgas(selectedOption).lgas;
  return (
    <div>
      <div className="my-5">
        <div className="text-black text-xl font-medium font-workSans">
          You don&apos;t have a default address
        </div>
        <div className="text-[#7B7B7B] text-base font-normal font-workSans leading-snug tracking-wide">
          Add a default address below
        </div>
      </div>
      <hr className="py-3 w-full" />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          <div className=" w-full md:w-1/2">
            <label
              htmlFor="firstName"
              className="text-[#7B7B7B] mb-2 font-workSans text-md font-semibold"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full p-2 border mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="lastName"
              className="text-[#7B7B7B] mb-2 font-workSans text-md font-semibold"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-[#7B7B7B] font-workSans font-semibold"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="phone number"
              className="text-[#7B7B7B] font-workSans font-semibold"
            >
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone number"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone Number"
              className="w-full p-2 border mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="phone number"
            className="text-[#7B7B7B] mb-2 font-workSans font-semibold"
          >
            Address:
          </label>
          <Textarea
            required
            name="address"
            value={formData.address}
            onChange={(e) => handleChangeTextarea(e, "address")}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 py-2 md:gap-5">
          <div className="w-full md:w-1/2">
            <div className="text-[#7B7B7B] mb-2 font-workSans font-semibold">
              <label htmlFor="state">State*:</label>
            </div>

            <Select
              size="lg"
              label="Select State"
              value={selectedOption}
              onChange={handleSelectChange}
              disabled
            >
              {NaijaStates.states().map((state, index) => (
                <Option key={index} value={state} label={state}>
                  {state}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-1/2">
            <div className="text-[#7B7B7B] mb-2 font-workSans font-semibold">
              <label htmlFor="lga">City*:</label>
            </div>
            {/* Replace Select with the default HTML select */}
            <select
              id="lga"
              value={selectedLga}
              onChange={handleSelectLga}
              className="w-full px-2 py-3 border rounded-lg outline-none border-[#7B7B7B] border-opacity-50"
              required
            >
              {deliveryPrices.map((cityObj, index) => (
                <option key={index} value={cityObj.city} className="capitalize">
                  {cityObj.city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="directions"
              className="text-[#7B7B7B] font-workSans font-semibold"
            >
              Additional Phone Number:
            </label>
            <input
              type="tel"
              id="phone number"
              name="AdditionalPhoneNumber"
              value={formData.AdditionalPhoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone Number"
              className="w-full p-2 border mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="phone number"
            className="text-[#7B7B7B] mb-2 font-workSans font-semibold"
          >
            Directions*:
          </label>
          <Textarea
            id="directions"
            value={formData.directions}
            onChange={(e) => handleChangeTextarea(e, "directions")}
          />
        </div>
        <div className="text-[#7B7B7B] py-3 text-base font-semibold font-workSans leading-snug tracking-wide">
          NB: Required Fields*
        </div>
        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-900 mt-4"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? "Saving..." : "Save and Continue"}
        </button>
      </form>
    </div>
  );
}
