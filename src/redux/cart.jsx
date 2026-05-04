import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  carte: [],
  cartCount: 0, // ← NEW: global badge count
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCarte: (state, action) => {
      state.carte = action.payload;
    },
    setCartCount: (state, action) => { // ← NEW
      state.cartCount = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.carte = [];
      state.cartCount = 0; // ← reset badge on logout/clear
    },
  },
});

export const { setCarte, setCartCount, setLoading, setError, clearCart } = cartSlice.actions;
export const carterReducer = cartSlice.reducer;