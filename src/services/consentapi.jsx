import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const consentApi = createApi({
  reducerPath: "consentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
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