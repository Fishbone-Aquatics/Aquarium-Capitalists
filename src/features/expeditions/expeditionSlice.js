import { createSlice } from '@reduxjs/toolkit';
import items from '../../data/items/items';
import { randomNumberInRange } from '../../utils/randomNumberInRange'; // Import the utility function

const loadInitialState = () => {
  const savedState = localStorage.getItem('expeditionState');
  if (savedState) {
    return JSON.parse(savedState);
  } else {
    return {
      name: "expedition",
      zones: [
        {
          name: 'Coral Reefs',
          description: 'Rich in colorful fish and rare coral species.',
          duration: 3, // seconds
          xpRange: [1, 3],
          lootDrops: [
            { type: 'item', item: items.equipment.heater, chance: 0.75 },
            { type: 'item', item: items.equipment.filter, chance: 0.05 },
            { type: 'item', item: items.equipment.light, chance: 0.05 },
            { type: 'currency', amountRange: [5, 10], chance: 0.2 },
            { type: 'currency', amountRange: [10, 20], chance: 0.1 }
          ]
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
            { type: 'currency', amountRange: [20, 30], chance: 0.1 }
          ]
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
            { type: 'currency', amountRange: [25, 35], chance: 0.1 }
          ]
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
            { type: 'currency', amountRange: [30, 40], chance: 0.1 }
          ]
        }
      ],
      activeZone: null,
    };
  }
};

export const expeditionSlice = createSlice({
  name: 'expedition',
  initialState: loadInitialState(),
  reducers: {
    setActiveZone: (state, action) => {
      state.activeZone = action.payload.zoneName;
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
    },
  },
});

export const { setActiveZone, clearActiveZone } = expeditionSlice.actions;

export default expeditionSlice.reducer;
