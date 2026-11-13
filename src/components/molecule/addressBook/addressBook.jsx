import { useEffect, useState } from "react";
import { Button, Radio, Typography } from "@material-tailwind/react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Delivery from "../delivery/delivery";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosClient from "../../../lib/axiosClient";

export default function AddressBook({
  selectedAddress,
  setSelectedAddress,
  existingArray,
  setExistingArray,
}) {
  const [showAddressBook, setShowAddressBook] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axiosClient
      .get(`checkout/address/${userId}`)
      .then((response) => {
        if (response.data.checkout) {
          setExistingArray(response.data.checkout);
          setShowAddressBook(true);
        }
      })
      .catch((error) => {
        console.error("Could not load saved addresses:", error);
        toast.error(
          error.response?.data?.message || "Could not load saved addresses.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, setExistingArray]);

  // Auto-select the first saved address once addresses have loaded, so the
  // delivery fee populates immediately instead of waiting for a manual click.
  useEffect(() => {
    if (!loading && existingArray.length > 0 && selectedAddress === null) {
      setSelectedAddress(0);
    }
  }, [loading, existingArray, selectedAddress, setSelectedAddress]);

  const handleAddAddressClick = () => {
    setShowAddressBook(false);
  };

  const handleAddressAdded = async () => {
    try {
      const { data } = await axiosClient.get(`checkout/address/${userId}`);
      const addresses = data.checkout ?? [];
      setExistingArray(addresses);
      if (addresses.length > 0) {
        setSelectedAddress(addresses.length - 1);
      }
      setShowAddressBook(true);
      return addresses.length > 0;
    } catch (error) {
      console.error(
        "Address saved, but saved addresses could not refresh:",
        error,
      );
      toast.error(
        "Address saved, but the address book could not refresh. Please reload checkout.",
      );
      return false;
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axiosClient.delete(`checkout/address/${id}`);
      const updatedArray = existingArray.filter(
        (address) => address.doc_id !== id,
      );
      setExistingArray(updatedArray);
      // If the deleted address was the selected one, clear the selection
      // so the auto-select effect can pick a new default (or clear the fee).
      const deletedIndex = existingArray.findIndex(
        (address) => address.doc_id === id,
      );
      if (deletedIndex === selectedAddress) {
        setSelectedAddress(updatedArray.length > 0 ? 0 : null);
      } else if (deletedIndex < selectedAddress) {
        setSelectedAddress(selectedAddress - 1);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(error.response?.data?.message || "Could not delete address.");
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
        <Delivery onAddressAdded={handleAddressAdded} />
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
