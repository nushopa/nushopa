import { useEffect, useState } from "react";
import { Button, Radio, Typography } from "@material-tailwind/react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Delivery from "../delivery/delivery";
import axios from "axios";

export default function AddressBook({
  handleDeliveryPrice,
  onAddressAdded,
  selectedAddress,
  setSelectedAddress,
  existingArray,
  setExistingArray
}) {
  const [showAddressBook, setShowAddressBook] = useState(true);
  const [loading, setLoading] = useState(true);
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  let baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setDeliveryLoading(true);
    axios
      .get(`${baseUrl}pricelist`)
      .then((response) => {
        if (response.data) {
          setDeliveryPrices(response.data.prices);
        }
      })
      .finally(() => {
        setDeliveryLoading(false);
      });
  }, [baseUrl]);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    axios
      .get(`${baseUrl}checkout/address/${userId}`)
      .then((response) => {
        if (response.data.checkout) {
          setShowAddressBook(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl]);

  // Auto-select the first saved address once addresses have loaded, so the
  // delivery fee populates immediately instead of waiting for a manual click.
  useEffect(() => {
    if (!loading && existingArray.length > 0 && selectedAddress === null) {
      setSelectedAddress(0);
    }
  }, [loading, existingArray, selectedAddress, setSelectedAddress]);

  useEffect(() => {
    if (!deliveryLoading && selectedAddress !== null) {
      const city = existingArray[selectedAddress]?.city;
      const estimatePrice = deliveryPrices.find(
        (cityObj) => cityObj.city === city
      )?.estimatePrice;
      handleDeliveryPrice(estimatePrice);
    }
  }, [
    deliveryPrices,
    deliveryLoading,
    selectedAddress,
    existingArray,
    handleDeliveryPrice,
  ]);

  const handleAddAddressClick = () => {
    setShowAddressBook(false);
  };

  const handleAddressAdded = () => {
    onAddressAdded();
    setShowAddressBook(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${baseUrl}checkout/address/${id}`);
      const updatedArray = existingArray.filter((address) => address.doc_id !== id);
      setExistingArray(updatedArray);
      // If the deleted address was the selected one, clear the selection
      // so the auto-select effect can pick a new default (or clear the fee).
      const deletedIndex = existingArray.findIndex((address) => address.doc_id === id);
      if (deletedIndex === selectedAddress) {
        setSelectedAddress(updatedArray.length > 0 ? 0 : null);
      } else if (deletedIndex < selectedAddress) {
        setSelectedAddress(selectedAddress - 1);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 my-5">
      {loading ? (
        <div className="w-full h-screen mt-10 justify-center flex">
          <span className="adressLoader"></span>
        </div>
      ) : existingArray.length > 0 && showAddressBook ? (
        existingArray.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded-lg p-3 border-mainGreen"
          >
            <div>
              <Radio
                name="description"
                color="green"
                label={
                  <div>
                    <Typography color="blue-gray" className="font-medium">
                      {item.first_name} {item.last_name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {item.address}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {item.city}
                    </Typography>
                  </div>
                }
                containerProps={{
                  className: "-mt-5",
                }}
                checked={selectedAddress === index}
                onChange={() => setSelectedAddress(index)}
              />
            </div>
            <button
              className="bg-transparent pr-4"
              onClick={() => handleDeleteAddress(item.doc_id)}
            >
              <TrashIcon className="w-6 h-6 text-red-900 cursor-pointer" />
            </button>
          </div>
        ))
      ) : (
        <Delivery
          onDeliveryPriceChange={handleDeliveryPrice}
          onAddressAdded={handleAddressAdded}
        />
      )}
      {showAddressBook && (
        <div>
          <Button
            onClick={handleAddAddressClick}
            variant="text"
            className="flex text-mainGreen items-center gap-2 w-[10rem]"
          >
            <PlusIcon className="text-mainGreen w-6 h-5" />
            <div>Add Address</div>
          </Button>
        </div>
      )}
    </div>
  );
}