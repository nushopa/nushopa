import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLazyGetProfileQuery } from "../../services/api";
import { addUser } from "../../redux/user";

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getProfile] = useLazyGetProfileQuery();
  const [params] = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (error) {
      navigate("/sign-in", { replace: true, state: { error } });
      return;
    }

    // The httpOnly cookie was already set by the backend redirect —
    // just confirm the session and pull the profile into Redux.
    getProfile()
      .unwrap()
      .then((res) => {
        dispatch(addUser(res.customer));
        navigate("/dashboard", { replace: true });
      })
      .catch(() => navigate("/sign-in", { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <p className="text-lg font-workSans">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;