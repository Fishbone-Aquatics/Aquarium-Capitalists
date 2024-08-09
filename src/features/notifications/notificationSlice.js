import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    message: null,
  },
  reducers: {
    setNotificationMessage: (state, action) => {
      state.message = action.payload;
    },
    clearNotificationMessage: (state) => {
      state.message = null;
    },
  },
});

export const { setNotificationMessage, clearNotificationMessage } = notificationSlice.actions;

export default notificationSlice.reducer;
