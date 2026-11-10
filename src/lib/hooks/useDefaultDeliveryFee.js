import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";

export default function useDefaultDeliveryFee() {
  const [deliveryFee, setDeliveryFee] = useState(null);

  useEffect(() => {
    let active = true;

    axiosClient
      .get("pricelist")
      .then(({ data }) => {
        const price = data?.prices?.[0]?.estimatePrice;
        if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
          throw new Error(
            "The delivery price list has no valid default price.",
          );
        }
        if (active) setDeliveryFee(price);
      })
      .catch((error) => {
        console.error("Could not load delivery price list:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return deliveryFee;
}
