// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userType: null, // 'buyer' or 'seller'
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    buyerLoginSuccess: (state, action) => {
      state.user = action.payload;
      state.userType = "buyer";
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    sellerLoginSuccess: (state, action) => {
      state.user = action.payload;
      state.userType = "seller";
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.userType = null;
    },
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  buyerLoginSuccess,
  sellerLoginSuccess,
  loginFailure,
  logout,
  updateUserData,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserType = (state) => state.auth.userType;
export const selectIsBuyer = (state) => state.auth.userType === "buyer";
export const selectIsSeller = (state) => state.auth.userType === "seller";
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
