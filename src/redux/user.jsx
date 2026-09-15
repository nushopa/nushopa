import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user: null,
    sessionChecked: false,
  },
  reducers: {
    addUser: (state, { payload }) => {
      state.isLoggedIn = true;
      state.user = payload;
      state.sessionChecked = true;
    },
    createUser: (state, { payload }) => {
      state.isLoggedIn = true;
      state.user = payload;
      state.sessionChecked = true;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.sessionChecked = true;
    },
  },
});

export const { addUser, createUser, clearUser } = userSlice.actions;
export default userSlice.reducer;