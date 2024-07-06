// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});
