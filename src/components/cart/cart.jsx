import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import DefaultLayout from "../../layouts/defaultLayout";
import axiosClient from "../../lib/axiosClient";
import AddCommasToNumber from "../../lib/util/addComma";
import {
  useIncrementMutation,
  useDecrementMutation,
  useDeleteSingleCartMutation,
} from "../../services/cart";

// Keep these in sync with FloatingCart
const DELIVERY_FEE = 1800;
const SERVICE_CHARGE_RATE = 0.15;

const naira = (n) => `\u20A6${AddCommasToNumber(n)}`;

// Keeps the first `max` words and adds an ellipsis if anything was cut.
const truncateWords = (text = "", max = 10) => {
  const words = String(text).trim().split(/\s+/);
  return words.length > max ? `${words.slice(0, max).join(" ")}\u2026` : words.join(" ");
};

const Loader = () => (
  <div className="flex w-full justify-center pt-40">
    <span className="cartLoader"></span>
  </div>
);

const EmptyCart = ({ onShop }) => (
  <div className="mx-auto my-16 flex max-w-md flex-col items-center text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
      <ShoppingBagIcon className="h-9 w-9 text-gray-400" />
    </div>
    <h2 className="mt-6 text-xl font-semibold text-gray-900">
      Your cart is empty
    </h2>
    <p className="mt-2 text-sm text-gray-500">
      Items you add will appear here so you can review them before checkout.
    </p>
    <button
      onClick={onShop}
      className="mt-6 rounded-lg bg-mainGreen px-6 py-3 text-sm font-medium text-white hover:opacity-90"
    >
      Start shopping
    </button>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm text-gray-600">
    <span>{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();
  const [deleteCart] = useDeleteSingleCartMutation();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Auth is cookie-based; the customer id comes from Redux (rehydrated
  // via SessionBootstrap), never from localStorage.
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    axiosClient
      .get(`cart/get/${userId}`)
      .then((response) => {
        if (response.data) setCarts(response.data.cart);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const reloadCart = async () => {
    const res = await axiosClient.get(`cart/get/${userId}`);
    setCarts(res.data.cart);
  };

  // Runs one cart mutation, then re-syncs. Locks the cart while it runs.
  const runUpdate = async (itemId, mutation) => {
    if (updatingId) return;
    setUpdatingId(itemId);
    try {
      const response = await mutation({ id: itemId });
      if (response.data) await reloadCart();
    } catch (error) {
      // handle error
    } finally {
      setUpdatingId(null);
    }
  };

  const items = useMemo(() => {
    const seen = new Set();
    return carts.filter((item) => {
      const pid = item.product_id?._id;
      if (!pid || seen.has(pid)) return false;
      seen.add(pid);
      return true;
    });
  }, [carts]);

  // Order summary maths — identical to FloatingCart
  const subtotal = carts.reduce(
    (t, item) => t + (item.product_id.product_price * item.product_quatity || 0),
    0,
  );
  const serviceCharges = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + DELIVERY_FEE + serviceCharges;

  return (
    <DefaultLayout>
      <Helmet>
        <title>Nushopa | Cart</title>
        <meta
          name="description"
          content="Review and manage your shopping cart at Nushopa, then proceed to checkout with ease."
        />
      </Helmet>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 font-workSans md:px-8">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyCart onShop={() => navigate("/")} />
        ) : (
          <>
            {/* Page header */}
            <div className="flex flex-wrap items-end justify-between gap-3 pb-6 pt-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                  Shopping cart
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-medium text-mainGreen hover:underline"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Continue shopping
              </button>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* ---------- Items ---------- */}
              <section className="min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
                {/* Column labels (desktop) */}
                <div className="hidden grid-cols-[1fr_140px_110px_40px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-medium text-gray-500 md:grid">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                <ul className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const p = item.product_id;
                    const isUpdating = updatingId === item._id;
                    const lineTotal = p.product_price * item.product_quatity;

                    return (
                      <li
                        key={item._id}
                        className={`grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 px-4 py-5 md:grid-cols-[1fr_140px_110px_40px] md:items-center md:gap-y-0 md:px-5 ${
                          isUpdating ? "opacity-60" : ""
                        }`}
                      >
                        {/* Product: image + name (image and text are grid
                            children on mobile, one flex row on desktop) */}
                        <div className="contents md:flex md:items-center md:gap-4">
                          <Link
                            to={`/product/${p._id}`}
                            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-1.5 md:h-24 md:w-24"
                          >
                            <img
                              src={p.product_image}
                              alt={p.product_name}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          </Link>
                          <div className="min-w-0 self-center">
                            <Link
                              to={`/product/${p._id}`}
                              title={p.product_name}
                              className="block break-words font-medium capitalize leading-snug text-gray-900 hover:text-mainGreen"
                            >
                              {truncateWords(p.product_name, 10)}
                            </Link>
                            <p className="mt-1 text-sm text-gray-500">
                              {naira(p.product_price)} each
                            </p>
                          </div>
                        </div>

                        {/* Quantity, line total, remove */}
                        <div className="col-span-2 flex items-center justify-between md:contents">
                          <div className="flex items-center justify-self-center rounded-full border border-gray-300">
                            <button
                              onClick={() => runUpdate(item._id, decrement)}
                              disabled={item.product_quatity <= 1 || !!updatingId}
                              aria-label="Decrease quantity"
                              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="min-w-[2.5ch] text-center text-sm font-medium text-gray-900">
                              {item.product_quatity}
                            </span>
                            <button
                              onClick={() => runUpdate(item._id, increment)}
                              disabled={!!updatingId}
                              aria-label="Increase quantity"
                              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-right font-semibold text-gray-900">
                            {naira(lineTotal)}
                          </p>

                          <button
                            onClick={() => runUpdate(item._id, deleteCart)}
                            disabled={!!updatingId}
                            aria-label={`Remove ${p.product_name}`}
                            title="Remove"
                            className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* ---------- Summary ---------- */}
              <aside className="w-full shrink-0 rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-28 lg:w-[360px]">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order summary
                </h2>

                <div className="mt-5 space-y-3">
                  <SummaryRow label="Subtotal" value={naira(subtotal)} />
                  <SummaryRow label="Delivery fee" value={naira(DELIVERY_FEE)} />
                  <SummaryRow
                    label="Service charges"
                    value={naira(serviceCharges)}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-semibold text-gray-900">
                    {naira(total)}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 h-12 w-full rounded-lg bg-mainGreen text-sm font-medium text-white hover:opacity-90"
                >
                  Proceed to checkout
                </button>
              </aside>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Cart;