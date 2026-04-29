import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    notificationDot: false,
  },
  reducers: {
    setNotificationDot: (state, action) => {
      state.notificationDot = action.payload;
    },
    markCustomersAsSeen: (state) => {
      state.notificationDot = false;
    },
  },
});

export const { setNotificationDot, markCustomersAsSeen } = customerSlice.actions;
export default customerSlice.reducer;
