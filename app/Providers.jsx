// Providers.js
"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "@/store/store";
import { persistStore } from "redux-persist";
import { useState, useEffect } from "react";

export default function Providers({ children }) {
  const [persistor, setPersistor] = useState(null);

  useEffect(() => {
    setPersistor(persistStore(store));
  }, []);

  if (!persistor) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
