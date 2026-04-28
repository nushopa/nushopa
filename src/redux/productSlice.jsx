import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/product/get/${productId}`
    );
    return response.data.product;
  }
);
export const fetchRelatedProducts = createAsyncThunk(
  "product/fetchRelatedProducts",
  async (productCat) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/product?product_cat=${productCat}`
    );

    return response.data;
  }
);
export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const relatedProductSlice = createSlice({
  name: "relatedProduct",
  initialState: {
    relatedProduct: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedProduct = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

