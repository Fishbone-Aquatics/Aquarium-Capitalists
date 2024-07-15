import { createSlice } from '@reduxjs/toolkit';
import playerReducers from './playerReducers';
import loadInitialState from './playerInitialState';
import { setActiveZone, clearActiveZone, calculateExpeditionDuration } from '../expeditions/expeditionSlice';
import { startGatheringResource, stopGatheringResource } from '../gathering/gatheringSlice';

const initialState = loadInitialState();

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    ...playerReducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(setActiveZone, (state, action) => {
        state.status = `Exploring ${action.payload.zoneName}`;
        state.expeditionStartTime = Date.now();
      })
      .addCase(clearActiveZone, (state) => {
        state.status = 'idle';
        calculateExpeditionDuration(state); // Update duration when expedition stops
      })
      .addCase(startGatheringResource, (state, action) => {
        state.status = `Gathering ${action.payload.resourceName}`;
      })
      .addCase(stopGatheringResource, (state) => {
        state.status = 'idle';
      });
  },
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
  swapEquipmentAndInventory,
  updateSkillXp,
  updateSkillBoostPercent,
  updateGatheringSpeed,
  updateGatheringEfficiency,
  updateExpeditionSpeed,
  setEquipmentFlag,
  swapInventoryAndEquipment,
  startExpedition,
  stopExpedition,
} = playerSlice.actions;

export default playerSlice.reducer;
