// src/features/player/playerInitialState.js
import items from '../../data/items/items';
import { deepMerge } from '../../utils/deepMerge'; // Import the deep merge utility

export const loadInitialState = () => {
  const initialState = {
    name: "Player",
    stats: {
      level: 1,
      xp: 0,
      currency: 0,
    },
    equipment: {
      heater: { ...items.equipment.emptySlot, type: 'Heater' },
      filter: { ...items.equipment.emptySlot, type: 'Filter' },
      light: { ...items.equipment.emptySlot, type: 'Light' },
    },
    inventory: [
      ...Array(16).fill({ ...items.equipment.emptySlot }),
    ],
    status: 'idle',
    maxInventorySlots: 16,
  };

  const savedState = localStorage.getItem('playerState');
  if (savedState) {
    return deepMerge(initialState, JSON.parse(savedState));
  } else {
    return initialState;
  }
};
