import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../../redux/user";
import { useLazyGetProfileQuery } from "../../services/api";

const ERROR_MESSAGES = {
  invalid_state: "Google sign-in failed a security check. Please try again.",
  google_auth_failed: "Google sign-in failed. Please try again.",
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getProfile] = useLazyGetProfileQuery();
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode / effect double-invocation running
    // this twice and firing duplicate requests or duplicate toasts.
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      toast.error(ERROR_MESSAGES[error] || "Google sign-in failed. Please try again.");
      navigate("/sign-in", { replace: true });
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = hashParams.get("token");

    if (!token) {
      toast.error("Google sign-in did not complete. Please try again.");
      navigate("/sign-in", { replace: true });
      return;
    }

    localStorage.setItem("token", token);
    // Strip the token out of the URL immediately so it doesn't linger
    // in browser history or get shared if the user copies the URL.
    window.history.replaceState({}, document.title, window.location.pathname);

    getProfile()
      .unwrap()
      .then((res) => {
        const customer = res.customer;
        localStorage.setItem("userId", customer._id);
        if (customer.profile_picture) {
          localStorage.setItem("profile-picture", customer.profile_picture);
        }
        dispatch(addUser(customer));
        toast.success("Logged in successfully");
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("token");
        toast.error("Could not load your profile. Please sign in again.");
        navigate("/sign-in", { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Finishing sign-in…</p>
    </div>
  );
};

export default AuthCallback;