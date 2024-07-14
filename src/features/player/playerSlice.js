import { createSlice } from '@reduxjs/toolkit';
import loadInitialState from './playerInitialState'; // Correct import for default export
import { playerReducers } from './playerReducers';
import { setActiveZone, clearActiveZone } from '../expeditions/expeditionSlice';
import { saveState } from './saveState'; 

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
      saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium }); // Pass the complete state
    });
    builder.addCase(clearActiveZone, (state) => {
      console.log('Expedition complete. - player slice');
      state.status = 'idle';
      saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium }); // Pass the complete state
    });
    builder.addMatcher(
      action => action.type.startsWith('player/'),
      (state) => {
        saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium }); // Pass the complete state
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
