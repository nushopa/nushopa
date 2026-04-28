import { useSelector } from "react-redux";

const useAuth = () => {
  const { isLoggedIn, user } = useSelector((state) => state.user);
  return { isAuthenticated: isLoggedIn, user };
};

export default useAuth;