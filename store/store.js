// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  // ✅ Import all necessary action types for serializableCheck
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
// ✅ IMPORTANT: Change this import to point to your custom storage utility
// Assuming your custom storage.js is located at '@/lib/storage'
import storage from "@/lib/storage";

// Persist configuration
const persistConfig = {
  key: "root",
  storage, // ✅ This now refers to your custom, SSR-aware storage
  whitelist: ["auth"], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here if you have them, e.g.:
  // products: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ensure all redux-persist actions are ignored to prevent warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
