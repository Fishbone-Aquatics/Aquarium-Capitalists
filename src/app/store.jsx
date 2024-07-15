// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import expeditionReducer from '../features/expeditions/expeditionSlice';
import aquariumReducer from '../features/aquariumshop/aquariumSlice';
import gatheringReducer from '../features/gathering/gatheringSlice';
import { saveState, loadState } from '../features/player/saveState';

// Load the preloaded state from localStorage
const preloadedState = loadState();

const rootReducer = {
  player: playerReducer,
  expedition: expeditionReducer,
  aquarium: aquariumReducer,
  gathering: gatheringReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

// Subscribe to store changes to save state to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export { store }; // Export as a named export
export default store; // Also export as default export
