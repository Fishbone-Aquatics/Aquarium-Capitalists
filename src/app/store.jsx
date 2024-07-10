// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import expeditionReducer from '../features/expeditions/expeditionSlice';
import { saveState } from '../features/player/saveState';

// Import other reducers as needed

const rootReducer = {
  player: playerReducer,
  expedition: expeditionReducer,
  // Add other reducers here
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Subscribe to store changes to save player state to localStorage
store.subscribe(() => {
  saveState(store.getState().player);
});

export { store }; // Export as a named export
export default store; // Also export as default export
