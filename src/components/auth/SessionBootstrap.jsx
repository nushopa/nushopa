import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetProfileQuery } from "../../services/api";
import { addUser, clearUser } from "../../redux/user";

const SessionBootstrap = () => {
  const dispatch = useDispatch();
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    getProfile()
      .unwrap()
      .then((res) => {
        if (res?.customer) {
          dispatch(addUser(res.customer));
        } else {
          dispatch(clearUser());
        }
      })
      .catch(() => {
        // No cookie, expired, or blacklisted — stay logged out.
        dispatch(clearUser());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default SessionBootstrap;