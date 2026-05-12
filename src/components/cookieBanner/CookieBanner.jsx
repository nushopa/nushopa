import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { acceptAll, rejectAll, savePreferences } from "../../redux/consentSlice";
import { useSaveConsentMutation } from "../../services/api";

const cookieOptions = [
  { key: "analytics", label: "Analytics", desc: "Traffic & usage statistics" },
  { key: "marketing", label: "Marketing", desc: "Ads & personalisation" },
];

export default function CookieBanner() {
  const consent = useSelector((state) => state.consent);
  const dispatch = useDispatch();
  const [saveConsentMutation] = useSaveConsentMutation();
  const [showManage, setShowManage] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  if (consent !== null) return null; 

  const handleSave = (action) => {
    const record = dispatch(action); 
    saveConsentMutation(record); 
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        {!showManage ? (
          <>
            <p className="mb-1 text-base font-semibold text-gray-900">🍪 We use cookies</p>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              We use cookies to improve your experience and analyse traffic.
              You can choose what to allow.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSave(acceptAll())}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Accept all
              </button>
              <button
                onClick={() => handleSave(rejectAll())}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Reject all
              </button>
              <button
                onClick={() => setShowManage(true)}
                className="px-2 py-2 text-sm text-gray-400 transition hover:text-gray-600"
              >
                Manage preferences
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <button
                onClick={() => setShowManage(false)}
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Go back"
              >
                ←
              </button>
              <p className="text-base font-semibold text-gray-900">Cookie preferences</p>
            </div>

            {/* Essential cookies */}
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Essential</p>
                <p className="text-xs text-gray-400">Login, cart, security</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Always on
              </span>
            </div>

            {/* Analytics + Marketing */}
            {cookieOptions.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between border-b border-gray-100 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                  className="h-4 w-4 cursor-pointer accent-gray-900"
                />
              </div>
            ))}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  const record = dispatch(savePreferences(prefs));
                  saveConsentMutation(record);
                }}
                className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Save preferences
              </button>
              <button
                onClick={() => setShowManage(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
