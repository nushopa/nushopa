import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../components/common/header/index.jsx";
import ScrollToTop from "../lib/util/scrollToTop.jsx";
import FloatingCart from "../components/cart/FloatingCart.jsx";
import useAuth from "../lib/hooks/useAuth.js";
import { setCartCount } from "../redux/cart.jsx";
import { useGetCartsQuery } from "../services/cart.jsx";

const MainLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const userId = user?._id;

  const { data } = useGetCartsQuery(userId, {
    skip: !isAuthenticated || !userId,
  });

  useEffect(() => {
    if (!data?.cart) return;
    const uniqueIds = new Set(data.cart.map((i) => i.product_id._id));
    dispatch(setCartCount(uniqueIds.size));
  }, [data, dispatch]);

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