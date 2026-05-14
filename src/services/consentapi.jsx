import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const consentApi = createApi({
  reducerPath: "consentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Attach JWT if present so the backend can tie consent to the user
      const token = getState().user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    saveConsent: builder.mutation({
      query: (consentPayload) => ({
        url: "/consent",
        method: "POST",
        body: consentPayload,
      }),
    }),
    getConsent: builder.query({
      query: () => "/consent",
    }),
  }),
});

export const { useSaveConsentMutation, useGetConsentQuery } = consentApi;