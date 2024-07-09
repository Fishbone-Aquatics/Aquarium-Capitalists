// src/features/player/playerInitialState.js
import items from '../../data/items/items';

export const loadInitialState = () => {
  const savedState = localStorage.getItem('playerState');
  if (savedState) {
    return JSON.parse(savedState);
  } else {
    return {
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
  }
};
