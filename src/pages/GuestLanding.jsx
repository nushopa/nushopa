import { useSelector } from "react-redux";
import Store from "./onboard/Store";
import Landing from "./landing";

const GuestLanding = () => {
  const { user } = useSelector((state) => state.user);

  if (user?._id) {
    return <Store />;
  }

  return <Landing />;
};

export default GuestLanding;
