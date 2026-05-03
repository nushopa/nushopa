import { useSelector } from "react-redux";
import Store from "./onboard/store";
import Landing from "./landing";
import { useEffect, useState } from "react";

const GuestLanding = () => {
  const { user } = useSelector((state) => state.user);
  const [ setBackendReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    console.log("🔍 VITE_BASE_URL:", baseUrl); // temporary debug log

    const wakeUpBackend = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout for cold start

        const response = await fetch(`${baseUrl}health`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          console.log("✅ Backend is awake");
          setBackendReady(true);
        } else {
          console.warn("⚠️ Backend responded but not OK:", response.status);
          setBackendReady(true); // still proceed
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.error("❌ Backend ping timed out after 60s");
        } else {
          console.error("❌ Backend ping failed:", error.message);
        }
        setBackendReady(true); // proceed anyway, let child components handle errors
      } finally {
        setChecking(false);
      }
    };

    if (baseUrl) {
      wakeUpBackend();
    } else {
      console.error("❌ VITE_BASE_URL is undefined! Check Vercel env vars.");
      setChecking(false);
      setBackendReady(false);
    }
  }, [baseUrl]);

  // Show a full-screen loader while waking up the backend
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="loader" />
        <p className="text-gray-500 text-sm font-workSans animate-pulse">
          Starting up, please wait...
        </p>
      </div>
    );
  }

  // If baseUrl is missing entirely, show a clear error
  if (!baseUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 px-4 text-center">
        <p className="text-red-500 font-semibold text-lg">
          Configuration error
        </p>
        <p className="text-gray-500 text-sm">
          The app is missing its backend URL. Please contact support.
        </p>
      </div>
    );
  }

  if (user?._id) {
    return <Store />;
  }

  return <Landing />;
};

export default GuestLanding;