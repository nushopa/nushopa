import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    // Send the httpOnly access-token cookie on every request. This is the
    // ONLY mechanism used for auth — no tokens are ever read from JS.
    credentials: "include",
  }),

  endpoints: (builder) => ({
    singleProduct: builder.query({
      query: (id) => `product/get/${id}`,
    }),
    getProfile: builder.query({
      query: () => "profile",
    }),
    relatedProducts: builder.query({
      query: (productCat) => `product?product_cat=${productCat}`,
    }),
    addressBook: builder.query({
      query: (customer_id) => `checkout/price/${customer_id}`,
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
    }),
    forgottenPassword: builder.mutation({
      query: (data) => ({
        url: "customers/forget",
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "customers/verify",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "customers/update",
        method: "POST",
        body: data,
      }),
    }),
    addReview: builder.mutation({
      query: (data) => ({
        url: "review/review",
        method: "POST",
        body: data,
      }),
    }),
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "news/subscribe",
        method: "POST",
        body: data,
      }),
    }),
    checkout: builder.mutation({
      query: (data) => ({
        url: "checkout/price",
        method: "POST",
        body: data,
      }),
    }),
    addOrder: builder.mutation({
      query: ({ data }) => ({
        url: `order`,
        method: "POST",
        body: data,
      }),
    }),

    // ── Payment / Paystack flow ─────────────────────────────────────────
    initializePayment: builder.mutation({
      query: (data) => ({
        url: "payment/initialize",
        method: "POST",
        body: data,
      }),
    }),
    getOrderStatus: builder.query({
      query: (reference) => `payment/status/${reference}`,
    }),

    addContact: builder.mutation({
      query: ({ data }) => ({
        url: "/contact/contact",
        method: "POST",
        body: data,
      }),
    }),

    // create user - sends OTP, no session yet
    createUser: builder.mutation({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: data,
      }),
    }),
    // OTP verification endpoint for registration — backend sets the
    // httpOnly cookie on success and returns the created customer.
    verifyRegistrationOTP: builder.mutation({
      query: (data) => ({
        url: "verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendRegistrationOTP: builder.mutation({
      query: (data) => ({
        url: "resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    saveConsent: builder.mutation({
      query: (data) => ({
        url: "consent",
        method: "POST",
        body: data,
      }),
    }),

    getAdverts: builder.query({
      query: () => "adverts",
      providesTags: ["Advert"],
    }),

    // Blacklists the current access token server-side and clears the
    // httpOnly cookie via Set-Cookie on the response.
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useCreateUserMutation,
  useCheckoutMutation,
  useAddressBookQuery,
  useSingleProductQuery,
  useRelatedProductsQuery,
  useAddOrderMutation,
  useInitializePaymentMutation,
  useGetOrderStatusQuery,
  useAddContactMutation,
  useSubscribeNewsletterMutation,
  useForgottenPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useAddReviewMutation,
  useVerifyRegistrationOTPMutation,
  useResendRegistrationOTPMutation,
  useLogoutUserMutation,
  useGetAdvertsQuery,
  useSaveConsentMutation,
  useLazyGetProfileQuery,
  useGetProfileQuery,
} = userApi;