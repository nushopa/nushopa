import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FullScreenLoader = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <span className="cartLoader" />
  </div>
);

function ProtectedRoute() {
  const { isLoggedIn, sessionChecked } = useSelector((state) => state.user);

  if (!sessionChecked) {
    return <FullScreenLoader />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export default ProtectedRoute;