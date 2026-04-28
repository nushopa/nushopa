import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  carte: [],
  loading: false,
  error: null,
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCarte: (state, action) => {
      state.carte = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.carte = []; // Reset the cart array to an empty array
    },
  },
});

export const { setCarte, setLoading, setError, clearCart } = cartSlice.actions;
export const carterReducer = cartSlice.reducer;
