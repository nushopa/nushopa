import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/protectedRoute/index.jsx";
import NotFoundPage from "./pages/error/ErrorPage.jsx";

import GuestLanding from "./pages/GuestLanding.jsx";
import AboutUs from "./pages/onboard/AboutUs.jsx";
import Store from "./pages/onboard/Store.jsx";
import Help from "./pages/onboard/Help.jsx";
import Contact from "./pages/onboard/Contact.jsx";
import Logistics from "./pages/onboard/Logistics.jsx";
import TermsAndConditions from "./pages/onboard/TermAndConditions.jsx";
import PrivacyPolicy from "./pages/onboard/PrivacyPolicy.jsx";

import UserSignIn from "./pages/auth/UserSignIn.jsx";
import UserSignUp from "./pages/auth/UserSignUp.jsx";
import OTPVerification from "./pages/auth/OTPVerification.jsx";
import UpdatePhoneNumber from "./pages/auth/UpdatePhoneNumber.jsx";
import ForgottenPassword from "./pages/auth/forgetPassword/ForgottenPassword.jsx";
import OtpPassword from "./pages/auth/forgetPassword/OtpPassword.jsx";
import ResetPassword from "./pages/auth/forgetPassword/ResetPassword.jsx";

import ProductDescription from "./pages/authenticatedPages/ProductDescription.jsx";
import Cart from "./components/cart/Cart.jsx";
import Checkout from "./pages/authenticatedPages/Checkout.jsx";
import MyOrder from "./pages/authenticatedPages/MyOrder.jsx";
import OrderDetails from "./pages/authenticatedPages/OrderDetails.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public routes with Layout (Header will be hidden on specific pages) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<GuestLanding />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/cart" element={<Store />} />
            <Route path="/help" element={<Help />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Auth routes (Header will be automatically hidden) */}
            <Route path="/sign-in" element={<UserSignIn />} />
            <Route path="/sign-up" element={<UserSignUp />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route
              path="/update-phone-number"
              element={<UpdatePhoneNumber />}
            />
            <Route path="/forgotten-password" element={<ForgottenPassword />} />
            <Route path="/otp-password" element={<OtpPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<GuestLanding />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-order" element={<MyOrder />} />
              <Route path="/order/:id" element={<OrderDetails />} />

              <Route path="/product/:id" element={<ProductDescription />} />
            </Route>
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </HelmetProvider>
  );
}

export default App;
