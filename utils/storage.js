// utils/storage.js
// This file provides a custom storage solution for redux-persist
// that handles server-side rendering (SSR) in Next.js.

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// A "noop" (no operation) storage for server-side environments (like Next.js SSR)
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// Conditionally use localStorage (client-side) or no-op storage (server-side)
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local") // Use localStorage when window object is available (browser)
    : createNoopStorage(); // Use the no-op storage when window is not defined (server)

export default storage;
