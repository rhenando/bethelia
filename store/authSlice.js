import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // includes roles array
  isLoggedIn: false,
  activeRole: null, // either 'buyer' or 'seller' for current session
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.activeRole = action.payload.activeRole || null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.activeRole = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
