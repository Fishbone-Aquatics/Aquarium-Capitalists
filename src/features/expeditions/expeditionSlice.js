import { createSlice } from '@reduxjs/toolkit';
import items from '../../data/items/items';

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
