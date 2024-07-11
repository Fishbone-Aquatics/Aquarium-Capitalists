import { createSlice } from '@reduxjs/toolkit';
import loadInitialState from './playerInitialState'; // Correct import for default export
import { playerReducers } from './playerReducers';
import { setActiveZone, clearActiveZone } from '../expeditions/expeditionSlice';
import { saveState } from './saveState'; 

const initialState = loadInitialState();

const playerSlice = createSlice({
  name: initialState.name,
  initialState,
  reducers: {
    ...playerReducers,
  },
  extraReducers: (builder) => {
    builder.addCase(setActiveZone, (state, action) => {
      state.status = `Exploring ${action.payload.zoneName}`;
      console.log('status should be exploring:', state.status);
      saveState(state); // Save the state
    });
    builder.addCase(clearActiveZone, (state) => {
      console.log('Expedition complete. - player slice');
      state.status = 'idle';
      saveState(state); // Save the state
    });
    builder.addMatcher(
      action => action.type.startsWith('player/'),
      (state) => {
        saveState(state); // Save the state for all player actions
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
  swapEquipmentAndInventory,
  updateSkillXp,
  updateSkillBoostPercent,
  updateGatheringSpeed,
  updateGatheringEfficiency,
  updateExpeditionSpeed,
  setEquipmentFlag,
  swapInventoryAndEquipment,
} = playerSlice.actions;

export default playerSlice.reducer;
