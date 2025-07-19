// lib/storage.js
// This file ensures localStorage is only accessed on the client-side.

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// A "noop" (no operation) storage for server-side rendering
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

// Conditionally use localStorage (client) or no-op storage (server)
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local") // Use localStorage when window is defined (client-side)
    : createNoopStorage(); // Use no-op storage when window is not defined (server-side)

export default storage;
