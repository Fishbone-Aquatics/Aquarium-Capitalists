// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import enemiesReducer from '../features/enemies/enemiesSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    enemies: enemiesReducer,
  },
});
