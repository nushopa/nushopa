import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../../layouts/defaultLayout";
import { ImagePlacehoderSkeleton } from "../../components/skeleton/imagePlacehoderSkeleton";
import {
  useAddToCartMutation,
  useDecrementMutation,
  useIncrementMutation,
} from "../../services/cart";
import axios from "axios";
import DisplayContent from "../../components/molecule/displayContent";
import { useDispatch } from "react-redux";
import { setCarte } from "../../redux/cart";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import AddCommasToNumber from "../../lib/util/AddComma";
import { truncateString } from "../../lib/util/truncateString";

export default function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [formattedDateWithSuffix, setFormattedDateWithSuffix] = useState("");
  const [active, setActive] = useState("");
  const [showQuantityDiv, setShowQuantityDiv] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cartId, setCartId] = useState(null);
  const [products, setProducts] = useState({});

  const userId = localStorage.getItem("userId");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      axios.get(`${baseUrl}cart/get/${userId}`).then((r) => {
        if (r.data) setCarts(r.data.cart);
      });
    }
    axios
      .get(`${baseUrl}product/get/${id}`)
      .then((r) => {
        if (r.data) setProducts(r.data);
      })
      .finally(() => setIsLoading(false));
  }, [baseUrl, id, userId]);

  useEffect(() => {
    carts.some((item) => {
      if (item.product_id._id === id) {
        setCartId(item._id);
        setProductQuantity(item.product_quatity);
        setShowQuantityDiv(true);
      }
    });
  }, [carts, id]);

  const product = products?.product;

  useEffect(() => {
    axios
      .get(`${baseUrl}product?product_cat=${product?.product_cat}`)
      .then((r) => {
        if (r.data) setRelatedProduct(r.data.products);
      });
  }, [baseUrl, product]);

  const [addToCart] = useAddToCartMutation();
  const [increment] = useIncrementMutation();
  const [decrement] = useDecrementMutation();

  useEffect(() => {
    if (product && !isLoading) {
      setFormattedDateWithSuffix(
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(product.createdAt)),
      );
      if (relatedProduct?.length) {
        setRelatedProducts(
          relatedProduct.filter((p) => p.product_cat === product.product_cat),
        );
      }
    }
  }, [product, isLoading, relatedProduct]);

  const handleIncrement = async (pid) => {
    try {
      const r = await increment({ id: pid });
      if (r.data) {
        const u = await axios.get(`${baseUrl}cart/get/${userId}`);
        setCarts(u.data.cart);
      }
    } catch {
      console.log("error", "item is not define");
    }
  };

  const handleDecrement = async (pid) => {
    try {
      const r = await decrement({ id: pid });
      if (r.data) {
        const u = await axios.get(`${baseUrl}cart/get/${userId}`);
        setCarts(u.data.cart);
      } else if (r.error?.status === 404) setShowQuantityDiv(false);
    } catch {
      setShowQuantityDiv(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const r = await addToCart({
        customer_id: userId,
        product_id: product._id,
      });
      if (r.data.product) {
        const u = await axios.get(`${baseUrl}cart/get/${userId}`);
        dispatch(setCarte(u.data.cart));
        setCarts(u.data.cart);
        setProductQuantity(r.data.product.product_quatity);
        setShowQuantityDiv(true);
      }
    } catch {
      toast.error("Could not add to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = product?.product_total <= 0;

  // Design tokens
  const green = "#2d7a4f";
  const greenLight = "#f0faf4";
  const border = "#e8e8e8";
  const textDark = "#111827";
  const textGray = "#6b7280";

  return (
    <DefaultLayout>
      <Helmet>
        <title>{product?.product_name ?? "Nushopa | Product"}</title>
        <meta
          name="description"
          content="Nushopa – Fresh farm produce delivered to your doorstep."
        />
      </Helmet>

      <div
        style={{
          background: "#f9fafb",
          minHeight: "100vh",
          padding: "28px 16px 64px",
        }}
      >
        {product && !isLoading && Object.keys(product).length ? (
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            {/* Breadcrumb */}
            <p
              style={{
                fontSize: 13,
                color: textGray,
                marginBottom: 20,
                margin: "0 0 20px",
              }}
            >
              <span
                onClick={() => navigate("/")}
                style={{ cursor: "pointer", color: green }}
              >
                Home
              </span>
              <span style={{ margin: "0 6px" }}>/</span>
              <span
                onClick={() => navigate("/")}
                style={{ cursor: "pointer", color: green }}
              >
                Products
              </span>
              <span style={{ margin: "0 6px" }}>/</span>
              <span>{product.product_name}</span>
            </p>

            {/* Main Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: `1px solid ${border}`,
                display: "flex",
                flexWrap: "wrap",
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              {/* ── Left: Images ── */}
              <div
                style={{
                  flex: "1 1 400px",
                  padding: 24,
                  background: "#fafafa",
                  borderRight: `1px solid ${border}`,
                }}
              >
                {/* Main image */}
                <img
                  src={active || product.product_image}
                  alt={product.product_name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    borderRadius: 8,
                    display: "block",
                    marginBottom: 12,
                    border: `1px solid ${border}`,
                  }}
                />

                {/* Thumbnails */}
                {product.alt_image?.length > 0 && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <img
                      src={product.product_image}
                      alt="main"
                      onClick={() => setActive("")}
                      loading="lazy"
                      style={{
                        width: 68,
                        height: 68,
                        objectFit: "cover",
                        borderRadius: 6,
                        cursor: "pointer",
                        border: `2px solid ${active === "" ? green : border}`,
                      }}
                    />
                    {product.alt_image.slice(0, 2).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`alt-${i}`}
                        onClick={() => setActive(img)}
                        loading="lazy"
                        style={{
                          width: 68,
                          height: 68,
                          objectFit: "cover",
                          borderRadius: 6,
                          cursor: "pointer",
                          border: `2px solid ${active === img ? green : border}`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: Info ── */}
              <div
                style={{
                  flex: "1 1 340px",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Product name */}
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: textDark,
                    margin: "0 0 4px",
                    lineHeight: 1.35,
                  }}
                >
                  {product.product_name}
                </h1>

                {/* Brand */}
                {product?.product_brand && (
                  <p
                    style={{
                      fontSize: 13,
                      color: textGray,
                      margin: "0 0 14px",
                    }}
                  >
                    Brand:{" "}
                    <span style={{ color: green, fontWeight: 600 }}>
                      {product.product_brand}
                    </span>
                  </p>
                )}

                {/* Price */}
                <p
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: green,
                    margin: "0 0 20px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  ₦{AddCommasToNumber(product.product_price)}
                </p>

                <div
                  style={{ height: 1, background: border, marginBottom: 18 }}
                />

                {/* Meta details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 22,
                  }}
                >
                  {[
                    ["Seller", "Nushopa", false],
                    ["Location", "Lagos State", false],
                    ["Listed", formattedDateWithSuffix, false],
                    [
                      "Quantity",
                      isOutOfStock
                        ? "Out of stock"
                        : `${product.product_total} units available`,
                      isOutOfStock,
                    ],
                  ].map(([label, value, isRed]) => (
                    <div
                      key={label}
                      style={{ display: "flex", alignItems: "center", gap: 0 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: textGray,
                          width: 80,
                          flexShrink: 0,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isRed ? "#dc2626" : textDark,
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{ height: 1, background: border, marginBottom: 20 }}
                />

                {/* Description */}
                <div
                  style={{
                    background: greenLight,
                    borderRadius: 8,
                    padding: "14px 16px",
                    border: `1px solid #c6e8d4`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: green,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      margin: "0 0 8px",
                    }}
                  >
                    Description
                  </p>
                  <div
                    style={{ fontSize: 13, color: "#374151", lineHeight: 1.75 }}
                  >
                    <DisplayContent
                      htmlContent={truncateString(product?.product_des, 500)}
                    />
                  </div>
                </div>
                {/* Cart controls */}
                <div style={{ marginTop: 22 }}>
                  {showQuantityDiv ? (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <span style={{ fontSize: 13, color: textGray }}>
                        Quantity
                      </span>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: `1.5px solid ${green}`,
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() => handleDecrement(cartId)}
                          style={{
                            width: 38,
                            height: 38,
                            background: "none",
                            border: "none",
                            fontSize: 18,
                            fontWeight: 700,
                            color: green,
                            cursor: "pointer",
                            borderRight: `1px solid ${border}`,
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            width: 44,
                            textAlign: "center",
                            fontSize: 15,
                            fontWeight: 600,
                            color: textDark,
                          }}
                        >
                          {productQuantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(cartId)}
                          style={{
                            width: 38,
                            height: 38,
                            background: "none",
                            border: "none",
                            fontSize: 18,
                            fontWeight: 700,
                            color: green,
                            cursor: "pointer",
                            borderLeft: `1px solid ${border}`,
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: 13, color: textGray }}>
                        units
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || isOutOfStock}
                      style={{
                        width: "100%",
                        padding: "13px 0",
                        background: isOutOfStock ? "#d1d5db" : green,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor:
                          isOutOfStock || isAddingToCart
                            ? "not-allowed"
                            : "pointer",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : isAddingToCart
                          ? "Adding to cart…"
                          : "Add to Cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div style={{ marginTop: 44 }}>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: textDark,
                    margin: "0 0 16px",
                  }}
                >
                  Related Products
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    overflowX: "auto",
                    paddingBottom: 8,
                  }}
                >
                  {relatedProducts.map((data, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/product/${data._id}`)}
                      style={{
                        minWidth: 172,
                        flexShrink: 0,
                        background: "#fff",
                        border: `1px solid ${border}`,
                        borderRadius: 10,
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <img
                        src={data.product_image}
                        alt={data.product_name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: 130,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div style={{ padding: "10px 12px" }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: textDark,
                            margin: "0 0 4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {data.product_name}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: green,
                            margin: 0,
                          }}
                        >
                          ₦{AddCommasToNumber(data.product_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <ImagePlacehoderSkeleton />
        )}
      </div>
    </DefaultLayout>
  );
}
