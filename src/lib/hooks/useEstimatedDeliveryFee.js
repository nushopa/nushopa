import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../axiosClient";

/**
 * Delivery fee for the customer's own delivery area.
 *
 * Checkout prices delivery from the city of the selected address, and it
 * pre-selects the customer's first saved address. We do the same here so the
 * cart shows the fee checkout will charge, instead of an arbitrary city's.
 *
 * Returns the fee in naira, or null when it can't be known yet (no saved
 * address, city not on the price list, still loading) — callers then show
 * "calculated at checkout". Pass a changing `refreshKey` to re-read it
 * (e.g. when the cart drawer opens, after an address was added/removed).
 */
export default function useEstimatedDeliveryFee(refreshKey = 0) {
  const userId = useSelector((state) => state.user.user?._id);
  const [deliveryFee, setDeliveryFee] = useState(null);

  useEffect(() => {
    if (!userId) {
      setDeliveryFee(null);
      return undefined;
    }

    let active = true;

    Promise.all([
      axiosClient.get(`checkout/address/${userId}`),
      axiosClient.get("pricelist"),
    ])
      .then(([addressRes, priceRes]) => {
        if (!active) return;
        const city = String(addressRes.data?.checkout?.[0]?.city ?? "").trim();
        const match = (priceRes.data?.prices ?? []).find(
          (entry) => String(entry.city ?? "").trim() === city,
        );
        const price = match?.estimatePrice;
        setDeliveryFee(
          city && Number.isFinite(price) && price >= 0 ? price : null,
        );
      })
      .catch((error) => {
        if (!active) return;
        console.error("Could not estimate the delivery fee:", error);
        setDeliveryFee(null);
      });

    return () => {
      active = false;
    };
  }, [userId, refreshKey]);

  return deliveryFee;
}
