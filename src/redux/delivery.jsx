import { createSlice } from "@reduxjs/toolkit";

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    delivery: [],
  },
  reducers: {
    addDelivery: (state, { payload }) => {
      return {
        ...state,
        delivery: [...state.delivery, payload],
      };
    },

    clearDelivery: (state) => {
      // Add logic to clear user-related data when logging out
      return { ...state, delivery: [] };
    },
  },
});

export const { addDelivery, clearDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;
