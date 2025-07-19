// app/ClientProviders.jsx
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster position='top-right' />
      </PersistGate>
    </Provider>
  );
}
