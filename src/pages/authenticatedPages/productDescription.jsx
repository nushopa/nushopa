import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

import axiosClient from "../../lib/axiosClient";
import useAuth from "../../lib/hooks/useAuth";
import AddCommasToNumber from "../../lib/util/addComma";
import ProductImage from "../../components/atoms/productImage";
import DashboardLayout from "../../layouts/DashboardLayout";
import { setCartCount, setCarte } from "../../redux/cart";
import {
  useAddToCartMutation,
  useDecrementMutation,
  useDeleteSingleCartMutation,
  useIncrementMutation,
} from "../../services/cart";
import {
  useSingleProductQuery,
  useRelatedProductsQuery,
} from "../../services/api";

/* Palette (from the reference design) */
const C = {
  page: "bg-[#F3F6F1]",
  panel: "bg-[#E6EDE3]",
  ink: "text-[#1F3A26]",
  muted: "text-[#6B7F70]",
  line: "border-[#C9D5C7]",
  dark: "bg-[#007145]",
};

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const ProductSkeleton = () => (
  <div className="grid gap-10 md:grid-cols-2 animate-pulse">
    <div>
      <div className="aspect-square w-full bg-[#E6EDE3]" />
      <div className="mt-4 flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 w-20 bg-[#E6EDE3]" />
        ))}
      </div>
    </div>
    <div className="space-y-4 pt-2">
      <div className="h-10 w-28 bg-[#E6EDE3]" />
      <div className="h-4 w-1/2 bg-[#E6EDE3]" />
      <div className="h-12 w-full bg-[#E6EDE3]" />
      <div className="h-12 w-full bg-[#E6EDE3]" />
    </div>
  </div>
);

const ErrorState = ({ message, onRetry, onBack }) => (
  <div className="w-full py-16 text-center">
    <p className="font-semibold text-red-600">{message}</p>
    <div className="mt-4 flex justify-center gap-3">
      {onRetry && (
        <button onClick={onRetry} className={`px-5 py-2 text-white ${C.dark}`}>
          Try again
        </button>
      )}
      <button
        onClick={onBack}
        className={`border px-5 py-2 ${C.line} ${C.ink}`}
      >
        Back to store
      </button>
    </div>
  </div>
);

const syncCartCount = (cartItems, dispatch) => {
  const uniqueIds = new Set(cartItems.map((i) => i.product_id?._id));
  dispatch(setCartCount(uniqueIds.size));
};

/* Turns stored HTML (even double-escaped HTML) into clean paragraphs. */
const toParagraphs = (html) => {
  if (!html) return [];
  let text = String(html);
  for (let i = 0; i < 2; i += 1) {
    const withBreaks = text.replace(
      /<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi,
      "$&\n",
    );
    const doc = new DOMParser().parseFromString(withBreaks, "text/html");
    text = doc.body.textContent || "";
  }
  return text
    .replace(/\u00a0/g, " ")
    .replace(/^[\s:]+/, "")
    .split(/\n+/)
    .map((t) => t.trim())
    .filter(Boolean);
};

/* Fills its frame. Falls back to ProductImage for non-URL values. */
const GalleryImage = ({ src, name, className = "" }) => {
  const isUrl = typeof src === "string" && /^(https?:|data:|blob:)/.test(src);
  if (!isUrl) {
    return <ProductImage product_image={src} truncatedProductName={name} />;
  }
  return (
    <img
      src={src}
      alt={name}
      className={`h-full w-full object-contain ${className}`}
    />
  );
};

export default function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const userId = user?._id;

  const { data, isLoading, isError, refetch } = useSingleProductQuery(id);
  const product = data?.product;

  const { data: relatedData } = useRelatedProductsQuery(product?.product_cat, {
    skip: !product?.product_cat,
  });
  const relatedProducts = useMemo(
    () => (relatedData?.products || []).filter((p) => p._id !== id).slice(0, 4),
    [relatedData, id],
  );

  const [addToCart] = useAddToCartMutation();
  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();
  const [deleteSingleCart] = useDeleteSingleCartMutation();

  const [cartItem, setCartItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [qty, setQty] = useState(1); // quantity chosen before adding
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState("description");

  // Reset per-product UI state when navigating between products
  useEffect(() => {
    setQty(1);
    setActiveImage(0);
    setTab("description");
  }, [id]);

  const stock = Number(product?.product_total) || 0;
  const outOfStock = Boolean(product && (product.out_of_stock || stock <= 0));

  const images = useMemo(() => {
    const raw = product?.product_image;
    if (!raw) return [];
    return Array.isArray(raw) ? raw.filter(Boolean) : [raw];
  }, [product]);

  const paragraphs = useMemo(
    () => toParagraphs(product?.product_des),
    [product],
  );

  const refreshCart = useCallback(async () => {
    if (!userId) return [];
    const res = await axiosClient.get(`cart/get/${userId}`);
    const cart = res.data?.cart || [];
    dispatch(setCarte(cart));
    syncCartCount(cart, dispatch);
    return cart;
  }, [userId, dispatch]);

  useEffect(() => {
    if (!userId || !id) return;
    let cancelled = false;
    refreshCart()
      .then((cart) => {
        if (!cancelled)
          setCartItem(cart.find((i) => i.product_id?._id === id) || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, id, refreshCart]);

  const requireAuth = () => {
    if (isAuthenticated) return true;
    navigate("/sign-in");
    return false;
  };

  const syncFromServer = async () => {
    const cart = await refreshCart();
    const item = cart.find((i) => i.product_id?._id === id) || null;
    setCartItem(item);
    return item;
  };

  // Adds the product, then bumps it up to the quantity picked in the stepper.
  const handleAdd = async () => {
    if (!requireAuth() || outOfStock || busy) return;
    setBusy(true);
    try {
      await addToCart({ customer_id: userId, product_id: id });
      const item = await syncFromServer();
      if (item) {
        for (let i = 1; i < qty; i += 1) {
          await increment({ id: item._id });
        }
        if (qty > 1) await syncFromServer();
      }
    } catch (e) {
      console.error("Failed to add to cart:", e);
    } finally {
      setBusy(false);
    }
  };

  const changeCartQty = async (fn) => {
    if (!requireAuth() || !cartItem || busy) return;
    setBusy(true);
    try {
      await fn({ id: cartItem._id });
    } catch (e) {
      // a 404 means the line is already gone; the sync below corrects state
    }
    try {
      await syncFromServer();
    } catch (e) {
      setCartItem(null);
    } finally {
      setBusy(false);
    }
  };

  const shownQty = cartItem ? cartItem.product_quatity : qty;
  const canDecrease = shownQty > 1 && !busy;
  const canIncrease = !outOfStock && shownQty < stock && !busy;

  const onMinus = () =>
    cartItem ? changeCartQty(decrement) : setQty((q) => Math.max(1, q - 1));
  const onPlus = () =>
    cartItem
      ? changeCartQty(increment)
      : setQty((q) => Math.min(q + 1, Math.max(stock, 1)));

  /* ---- render ------------------------------------------------------ */

  const goHome = () => navigate("/");
  let content;

  if (isLoading) {
    content = <ProductSkeleton />;
  } else if (isError || !product) {
    content = (
      <ErrorState
        message="Couldn't load this product."
        onRetry={refetch}
        onBack={goHome}
      />
    );
  } else {
    const details = [
      ["Brand", product.product_brand_name],
      ["Category", product.product_cat],
      ["Sub-category", product.product_sub_cat],
      ["Type", product.product_sub_sub_cat],
    ].filter(([, v]) => v);

    content = (
      <>
        <Helmet>
          <title>{`Nushopa | ${product.product_name}`}</title>
        </Helmet>

        <div className="grid gap-10 md:grid-cols-2">
          {/* ---------- Gallery ---------- */}
          <div>
            <div className={`border p-3 ${C.line} ${C.page}`}>
              <div
                className={`flex aspect-square w-full items-center justify-center overflow-hidden p-6 ${C.panel}`}
              >
                <GalleryImage
                  src={images[activeImage] ?? product.product_image}
                  name={product.product_name}
                />
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === activeImage}
                    className={`h-20 w-20 shrink-0 p-2 ${C.panel} ${
                      i === activeImage
                        ? "outline outline-1 outline-[#1F3A26]"
                        : ""
                    }`}
                  >
                    <GalleryImage src={img} name={product.product_name} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Buy box ---------- */}
          <div className={`min-w-0 ${C.ink}`}>
           
            <h1 className="mt-1 break-words text-2xl font-medium md:text-3xl">
              {product.product_name}
            </h1>

            <p className="mt-4 text-3xl font-semibold md:text-4xl">
              &#x20A6;{AddCommasToNumber(product.product_price)}
            </p>

            {outOfStock && (
              <p className="mt-3 inline-block bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                Out of Stock
              </p>
            )}

            <p className="mt-8 text-base">Amount</p>

            <div className="mt-2 flex items-center gap-4">
              <div
                className={`flex items-center gap-2 rounded-full px-2 py-1 ${C.panel}`}
              >
                <button
                  onClick={onMinus}
                  disabled={!canDecrease}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-30"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <span className="min-w-[3ch] text-center text-base">
                  {shownQty}
                </span>
                <button
                  onClick={onPlus}
                  disabled={!canIncrease}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-30"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              {!outOfStock && (
                <span className={`text-sm ${C.muted}`}>
                  Current stock: {stock}
                </span>
              )}
            </div>

            <div className="my-14">
              {/* ---------- Tabs ---------- */}
              <div className={`mt-10 flex border-b ${C.line}`} role="tablist">
                {[
                  ["description", "Description"],
                  ["details", "Details"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={`-mb-px flex-1 border-b-2 py-3 text-base ${
                      tab === key
                        ? "border-[#1F3A26] text-[#1F3A26]"
                        : `border-transparent ${C.muted}`
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="pt-5 leading-relaxed" role="tabpanel">
                {tab === "description" ? (
                  paragraphs.length ? (
                    <div className="max-w-prose space-y-4 text-[15px] leading-7 text-[#2F4A36]">
                      {paragraphs.map((t, i) => (
                        <p key={i}>{t}</p>
                      ))}
                    </div>
                  ) : (
                    <p className={C.muted}>No description available.</p>
                  )
                ) : details.length ? (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
                    {details.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className={C.muted}>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className={C.muted}>No details available.</p>
                )}
              </div>
            </div>
            {/* Primary action */}
            {cartItem ? (
              <>
                <Link
                  to="/cart"
                  className={`mt-6 flex h-14 w-full items-center justify-center text-white ${C.dark}`}
                >
                  View cart
                </Link>
                <button
                  onClick={() => changeCartQty(deleteSingleCart)}
                  disabled={busy}
                  className={`mt-3 flex h-14 w-full items-center justify-center border disabled:opacity-50 ${C.line} ${C.ink}`}
                >
                  Remove from cart
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                disabled={outOfStock || busy}
                className={`mt-6 flex h-14 w-full items-center justify-center text-white disabled:cursor-not-allowed disabled:opacity-50 ${C.dark}`}
              >
                {busy
                  ? "Adding..."
                  : outOfStock
                    ? "Out of stock"
                    : "Add to cart"}
              </button>
            )}
          </div>
        </div>

        {/* ---------- Related ---------- */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className={`mb-4 text-xl font-medium ${C.ink}`}>
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="block">
                  <div
                    className={`flex aspect-square items-center justify-center p-4 ${C.panel}`}
                  >
                    <ProductImage
                      product_image={p.product_image}
                      truncatedProductName={p.product_name}
                    />
                  </div>
                  <p className={`mt-2 truncate font-medium ${C.ink}`}>
                    {p.product_name}
                  </p>
                  <p className={C.muted}>
                    &#x20A6;{AddCommasToNumber(p.product_price)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </>
    );
  }

  return (
    <DashboardLayout>
      <div className="mt-7 w-full font-workSans">{content}</div>
    </DashboardLayout>
  );
}
