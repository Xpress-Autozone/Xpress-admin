import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../productSlice";
import authReducer from "../authSlice";
import dashboardReducer from "../dashboardSlice";
import vendorReducer from "../vendorSlice";
import orderReducer from "../orderSlice";
import customerReducer from "../customerSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    vendors: vendorReducer,
    orders: orderReducer,
    customers: customerReducer,
  },
});
