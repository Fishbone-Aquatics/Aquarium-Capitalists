// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import expeditionReducer from '../features/expeditionSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    expedition: expeditionReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
