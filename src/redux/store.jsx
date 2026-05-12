import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user"; // default export is already the reducer
import { productSlice, relatedProductSlice } from "./productSlice";
import { userApi } from "../services/api";
import { cartApi } from "../services/cart";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { carterReducer } from "./cart";
import consentReducer from "./consentSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  carte: carterReducer,
  product: productSlice.reducer,
  relatedProduct: relatedProductSlice.reducer,
  consent: consentReducer,
  [userApi.reducerPath]: userApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      ignoredActions: [
        "userApi/fulfilled",
        "userApi/pending",
        "userApi/rejected",
        "cartApi/fulfilled",
        "cartApi/pending",
        "cartApi/rejected",
      ],
    }).concat(userApi.middleware, cartApi.middleware),
});

export const persistor = persistStore(store);

export default store;
