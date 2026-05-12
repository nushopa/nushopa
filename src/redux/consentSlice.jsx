import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cookie_consent";
const CONSENT_VERSION = "1.0";

const initialState = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.version === CONSENT_VERSION) {
      return parsed;
    }
  }
  return null;
})();

const consentSlice = createSlice({
  name: "consent",
  initialState,
  reducers: {
    acceptAll: () => {
      const record = {
        preferences: { essential: true, analytics: true, marketing: true },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      return record;
    },
    rejectAll: () => {
      const record = {
        preferences: { essential: true, analytics: false, marketing: false },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      return record;
    },
    savePreferences: (state, action) => {
      const record = {
        preferences: { essential: true, ...action.payload },
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      return record;
    },
  },
});

export const { acceptAll, rejectAll, savePreferences } = consentSlice.actions;
export default consentSlice.reducer;