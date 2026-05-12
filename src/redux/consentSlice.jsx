import { createSlice } from "@reduxjs/toolkit";

const CONSENT_VERSION = "1.0.0";

const initialState = null; // null = not yet decided, object = decided

const consentSlice = createSlice({
  name: "consent",
  initialState,
  reducers: {
    acceptAll: () => ({
      preferences: { essential: true, analytics: true, marketing: true },
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }),

    rejectAll: () => ({
      preferences: { essential: true, analytics: false, marketing: false },
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }),

    savePreferences: (_, action) => ({
      preferences: {
        essential: true,
        analytics: Boolean(action.payload.analytics),
        marketing: Boolean(action.payload.marketing),
      },
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }),

    resetConsent: () => null,
  },
});

export const { acceptAll, rejectAll, savePreferences, resetConsent } =
  consentSlice.actions;

export default consentSlice.reducer;