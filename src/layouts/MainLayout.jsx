import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/header/index.jsx";
import ScrollToTop from "../lib/util/scrollToTop.jsx";
import FloatingCart from "../components/cart/FloatingCart.jsx";

const MainLayout = () => {
  const location = useLocation();

  // Routes where Header should be hidden
  const noHeaderRoutes = [
    "/privacy-policy",
    "/sign-in",
    "/sign-up",
    "/verify-otp",
    "/update-phone-number",
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
