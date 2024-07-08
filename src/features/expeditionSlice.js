import { createSlice } from '@reduxjs/toolkit';
import items from '../data/items/items';

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
          duration: 10, // seconds
          xpRange: [1, 3],
          itemDrops: [
            { item: items.boneKnife, chance: 0.1 },
            { item: items.katana, chance: 0.05 }
          ],
          currencyDrops: [
            { amount: 5, chance: 0.2 },
            { amount: 10, chance: 0.1 }
          ]
        },
        {
          name: 'Shipwrecks',
          description: 'Chance to find hidden treasures and ancient artifacts.',
          duration: 30, // seconds
          xpRange: [3, 5],
          itemDrops: [
            { item: items.woodenShield, chance: 0.1 },
            { item: items.katana, chance: 0.05 }
          ],
          currencyDrops: [
            { amount: 10, chance: 0.2 },
            { amount: 20, chance: 0.1 }
          ]
        },
        {
          name: 'Deep Sea Trenches',
          description: 'Home to exotic and rare deep-sea creatures.',
          duration: 45, // seconds
          xpRange: [4, 7],
          itemDrops: [
            { item: items.boneKnife, chance: 0.1 },
            { item: items.katana, chance: 0.05 }
          ],
          currencyDrops: [
            { amount: 15, chance: 0.2 },
            { amount: 25, chance: 0.1 }
          ]
        },
        {
          name: 'Underwater Caves',
          description: 'Potential for discovering unique plant species and minerals.',
          duration: 60, // seconds
          xpRange: [5, 10],
          itemDrops: [
            { item: items.bread, chance: 0.1 },
            { item: items.apple, chance: 0.05 }
          ],
          currencyDrops: [
            { amount: 20, chance: 0.2 },
            { amount: 30, chance: 0.1 }
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
