import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include", // ← NEW: include credentials for cook
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({

    getCarts: builder.query({
      query: (userId) => `cart/get/${userId}`,
      providesTags: ["Cart"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    addToCart: builder.mutation({
      query: (data) => ({
        url: "cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    increment: builder.mutation({
      query: (id) => ({
        url: "cart/inc",
        method: "PUT",
        body: id,
      }),
      invalidatesTags: ["Cart"],
    }),

    decrement: builder.mutation({
      query: (id) => ({
        url: "cart/dec",
        method: "PUT",
        body: id,
      }),
      invalidatesTags: ["Cart"],
    }),
    
    // delete single cart
    deleteSingleCart: builder.mutation({
      query: (id) => ({
        url: "/cart/delete", // Adjust the endpoint according to your API
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartsQuery,
  useAddToCartMutation,
  useDecrementMutation,
  useIncrementMutation,
  useDeleteSingleCartMutation,
} = cartApi;
