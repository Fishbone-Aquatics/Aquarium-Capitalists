import { createSlice } from '@reduxjs/toolkit';
import { saveState } from '../player/saveState';
import zones from './expeditionZones';

const initialState = {
  name: "expedition",
  zones: zones,
  activeZone: null,
  statistics: {
    expeditionsCompleted: 0,
    totalCurrency: 0,
    currencyPerHour: 0,
    totalXp: 0,
    xpPerHour: 0,
    lootedItems: [],
    expeditionDuration: '0 seconds' // Initialize the duration
  },
  expeditionStartTime: null,
};

const expeditionSlice = createSlice({
  name: 'expedition',
  initialState,
  reducers: {
    setActiveZone: (state, action) => {
      state.activeZone = action.payload.zoneName;
      state.statistics = {
        expeditionsCompleted: 0,
        totalCurrency: 0,
        currencyPerHour: 0,
        totalXp: 0,
        xpPerHour: 0,
        lootedItems: [],
        expeditionDuration: '0 seconds', // Reset the duration
      };
      state.expeditionStartTime = Date.now();
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
    },
    updateStatistics: (state, action) => {
      const { expeditionsCompleted, totalCurrency, currencyPerHour, totalXp, xpPerHour, lootedItems } = action.payload;
      state.statistics = {
        expeditionsCompleted,
        totalCurrency,
        currencyPerHour,
        totalXp,
        xpPerHour,
        lootedItems,
        expeditionDuration: state.statistics.expeditionDuration, // Ensure the duration is preserved
      };
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

      state.statistics.expeditionDuration = formattedDuration;
      saveState({ player: state.player, expedition: state, aquarium: state.aquarium }); // Correct saveState call
    },
  },
});

export const { setActiveZone, clearActiveZone, updateStatistics, calculateExpeditionDuration } = expeditionSlice.actions;

export default expeditionSlice.reducer;
