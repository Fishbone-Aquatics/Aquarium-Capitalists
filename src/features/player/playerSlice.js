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
    startExpedition: (state) => {
      state.expeditionStartTime = Date.now();
      state.status = 'exploring';
      saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
    },
    stopExpedition: (state) => {
      state.expeditionDuration = '0 seconds';
      state.status = 'idle';
      saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
    },
    calculateExpeditionDuration: (state) => {
      const now = Date.now();
      const startTime = state.expeditionStartTime || now;
      const duration = Math.floor((now - startTime) / 1000); // duration in seconds

      let formattedDuration;
      if (duration < 60) {
        formattedDuration = `${duration} seconds`;
      } else if (duration < 3600) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        formattedDuration = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
      } else {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        formattedDuration = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }

      state.expeditionDuration = formattedDuration;
      saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
    }
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
  startExpedition,
  stopExpedition,
  calculateExpeditionDuration
} = playerSlice.actions;

export default playerSlice.reducer;
