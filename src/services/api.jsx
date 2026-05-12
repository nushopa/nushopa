import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    singleProduct: builder.query({
      query: (id) => `product/get/${id}`,
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
    addContact: builder.mutation({
      query: ({ data }) => ({
        url: "/contact/contact",
        method: "POST",
        body: data,
      }),
    }),
    // create user - now sends OTP
    createUser: builder.mutation({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: data,
      }),
    }),
    // OTP verification endpoint for registration
    verifyRegistrationOTP: builder.mutation({
      query: (data) => ({
        url: "verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    // Resend OTP for registration
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
} = userApi;
