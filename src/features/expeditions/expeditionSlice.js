import { createSlice } from '@reduxjs/toolkit';
import items from '../../data/items/items';
import { saveState } from '../player/saveState';

const initialState = {
  name: "expedition",
  zones: [
    {
      name: 'Coral Reefs',
      description: 'Rich in colorful fish and rare coral species.',
      duration: 3, // seconds
      xpRange: [1, 3],
      lootDrops: [
        { type: 'item', item: items.equipment.filter, chance: 0.0033 },
        { type: 'item', item: items.equipment.spongeFilter, chance: 0.0033 },
        { type: 'item', item: items.equipment.light, chance: 0.0033 },
        { type: 'currency', amountRange: [5, 10], chance: 0.2 },
      ],
      image: 'icons/expeditions/coralReef.png' 
    },
    {
      name: 'Shipwrecks',
      description: 'Chance to find hidden treasures and ancient artifacts.',
      duration: 30, // seconds
      xpRange: [3, 5],
      lootDrops: [
        { type: 'item', item: items.equipment.canisterFilter, chance: 0.005 },
        { type: 'item', item: items.equipment.largeFilter, chance: 0.002 },
        { type: 'currency', amountRange: [10, 20], chance: 0.2 },
      ],
      image: 'icons/expeditions/shipwreck.png' 
    },
    {
      name: 'Deep Sea Trenches',
      description: 'Home to exotic and rare deep-sea creatures.',
      duration: 45, // seconds
      xpRange: [4, 7],
      lootDrops: [
        { type: 'item', item: items.equipment.largeHeater, chance: 0.005 },
        { type: 'item', item: items.equipment.mediumHeater, chance: 0.05 },
        { type: 'currency', amountRange: [15, 25], chance: 0.2 },
      ],
      image: 'icons/expeditions/trench.png' 
    },
    {
      name: 'Underwater Caves',
      description: 'Potential for discovering unique plant species and minerals.',
      duration: 60, // seconds
      xpRange: [5, 10],
      lootDrops: [
        { type: 'item', item: items.bread, chance: 0.1 },
        { type: 'item', item: items.apple, chance: 0.05 },
        { type: 'currency', amountRange: [20, 30], chance: 0.2 },
      ],
      image: 'icons/expeditions/underwaterCave.png'
    }
  ],
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
