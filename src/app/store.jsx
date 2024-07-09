// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import expeditionReducer from '../features/expeditions/expeditionSlice';
// Import other reducers as needed

const rootReducer = {
  player: playerReducer,
  expedition: expeditionReducer,
  // Add other reducers here
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
