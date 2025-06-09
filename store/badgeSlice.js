import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
  messagesCount: 0,
  loading: true,
};

const badgeSlice = createSlice({
  name: "badge",
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    setMessagesCount: (state, action) => {
      state.messagesCount = action.payload;
    },
    setBadgeLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCartCount, setMessagesCount, setBadgeLoading } =
  badgeSlice.actions;

export default badgeSlice.reducer;
