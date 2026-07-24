import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../../redux/user";
import { useLazyGetProfileQuery } from "../../services/api";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getProfile] = useLazyGetProfileQuery();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/sign-in");
      return;
    }

    localStorage.setItem("token", token);

    getProfile()
      .unwrap()
      .then((res) => {
        const user = res.customer ?? res;
        localStorage.setItem("userId", user._id);
        if (user.profile_picture) {
          localStorage.setItem("profile-picture", user.profile_picture);
        }
        dispatch(addUser(user));
        toast.success("Logged in successfully");
        navigate("/dashboard");
      })
      .catch(() => {
        localStorage.removeItem("token");
        toast.error("Could not complete sign-in. Please try again.");
        navigate("/sign-in");
      });
  }, [searchParams, navigate, dispatch, getProfile]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <p>Signing you in…</p>
    </div>
  );
};

export default AuthCallback;