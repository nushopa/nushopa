import { useSelector, useDispatch } from "react-redux";
import { acceptAll, rejectAll } from "../../redux/consentSlice";
import { useSaveConsentMutation } from "../../services/api";

const CONSENT_VERSION = "1.0.0";

export default function CookieBanner() {
  const consent = useSelector((state) => state.consent);
  const dispatch = useDispatch();
  const [saveConsentMutation, { isLoading }] = useSaveConsentMutation();

  if (consent !== null) return null;

  const handleAccept = async () => {
    dispatch(acceptAll());
    try {
      await saveConsentMutation({
        preferences: { essential: true, analytics: true, marketing: true },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      }).unwrap();
    } catch (err) {
      console.error("Failed to persist consent:", err);
    }
  };

  const handleReject = async () => {
    dispatch(rejectAll());
    try {
      await saveConsentMutation({
        preferences: { essential: true, analytics: false, marketing: false },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      }).unwrap();
    } catch (err) {
      console.error("Failed to persist consent:", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <p className="mb-3 text-base font-semibold text-gray-900">
          🍪 We use cookies
        </p>

        {/* ↓ Stack on mobile, row on sm+ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-gray-500">
            Nushopa uses cookies and other tracking technologies, including
            session replay tools (&quot;Cookies&quot;), to gather information
            about you and your device to improve our services, conduct analytics
            to gain insights about how you interact with our websites and
            services, evaluate and improve advertising, and enhance performance
            and functionality.{" "}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Statement
            </a>
            .
          </p>

          {/* ↓ Buttons fill width on mobile, shrink on sm+ */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[#007145] px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60 sm:flex-none"
            >
              Accept all
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 sm:flex-none"
            >
              Reject all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
