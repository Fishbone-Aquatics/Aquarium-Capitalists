// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../features/player/playerSlice';
import expeditionReducer from '../features/expeditions/expeditionSlice';
import aquariumReducer from '../features/aquariumshop/aquariumSlice';
import gatheringReducer from '../features/gathering/gatheringSlice';
import { saveState, loadState } from '../features/player/saveState';

const preloadedState = loadState();

const rootReducer = {
  player: playerReducer,
  expedition: expeditionReducer,
  aquarium: aquariumReducer,
  gathering: gatheringReducer,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export { store };
export default store;

