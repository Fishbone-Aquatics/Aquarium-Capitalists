// src/features/player/playerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loadInitialState } from './playerInitialState';
import { playerReducers } from './playerReducers';
import { setActiveZone, clearActiveZone } from '../expeditions/expeditionSlice';

const initialState = loadInitialState();

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    ...playerReducers,
  },
  extraReducers: (builder) => {
    builder.addCase(setActiveZone, (state, action) => {
      state.status = `Exploring ${action.payload.zoneName}`;
      console.log('status should be exploring:', state.status);
    });
    builder.addCase(clearActiveZone, (state) => {
      console.log('Expedition complete. - player slice');
      state.status = 'idle';
    });
    builder.addMatcher(
      action => action.type.startsWith('player/'),
      (state) => {
        localStorage.setItem('playerState', JSON.stringify(state));
      }
    );
  }
});

export const {
  updateStats,
  addXp,
  addCurrency,
  addItemToInventory,
  removeItemFromInventory,
  updateInventorySize,
  equipItem,
  unequipItem,
  swapItems,
  swapEquipmentAndInventory
} = playerSlice.actions;

export default playerSlice.reducer;
