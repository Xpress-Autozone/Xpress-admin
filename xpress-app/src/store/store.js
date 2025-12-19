import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../productSlice";
import authReducer from "../authSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
  },
});
