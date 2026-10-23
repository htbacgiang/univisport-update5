import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// SSR-safe storage: localStorage on client, noop on server
const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null); },
  setItem(_key, value) { return Promise.resolve(value); },
  removeItem() { return Promise.resolve(); },
});
const storage = typeof window !== "undefined"
  ? require("redux-persist/lib/storage").default
  : createNoopStorage();

// Import Reducers
import cartReducers from "./cartSlice";
import expandSidebar from "./ExpandSlice";
import dialog from "./DialogSlice";
import product from "./productSlice";
import wishlist from "./wishlistSlice";

// Combine Reducers
const reducers = combineReducers({
  cart: cartReducers,
  wishlist,
  product,
  expandSidebar,
  dialog,
});

// Persist Config — product selection không cần persist
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["product"],
};

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
