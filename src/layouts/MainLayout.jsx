import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosClient from "../lib/axiosClient";
import Header from "../components/common/header/index.jsx";
import ScrollToTop from "../lib/util/scrollToTop.jsx";
import FloatingCart from "../components/cart/FloatingCart.jsx";
import useAuth from "../lib/hooks/useAuth.js";
import { setCartCount } from "../redux/cart.jsx";

const MainLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const syncCartCount = async () => {
      try {
        const { data } = await axiosClient.get(`cart/get/${userId}`);
        const items = data?.cart ?? [];
        const uniqueIds = new Set(items.map((i) => i.product_id._id));
        dispatch(setCartCount(uniqueIds.size));
      } catch (err) {
        console.error("Failed to sync cart count:", err);
      }
    };

    syncCartCount();
  }, [isAuthenticated, userId, dispatch]);

  const noHeaderRoutes = [
    "/privacy-policy",
    "/sign-in",
    "/sign-up",
    "/verify-otp",
    "/forgotten-password",
    "/otp-password",
    "/reset-password",
  ];
  const hideHeader = noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <ScrollToTop />
      <FloatingCart />
      <Outlet />
    </>
  );
};

export default MainLayout;