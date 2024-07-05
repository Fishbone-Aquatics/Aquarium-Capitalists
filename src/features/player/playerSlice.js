import { createSlice } from '@reduxjs/toolkit';
import items from '../../app/items.jsx'; // Assuming the items file is in the same directory

// Define a function to load the initial state from localStorage or fall back to a default state
const loadInitialState = () => {
  const savedState = localStorage.getItem('playerState');
  if (savedState) {
    return JSON.parse(savedState);
  } else {
    return {
      name: "Player",
      stats: {
        strength: 10,
        agility: 5,
        intelligence: 7,
        maxInventorySlots: 16,
        health: 100 // Starting health
      },
      equipment: {
        head: null,
        chest: null,
        pants: null,
        boots: null,
        weapon: items.boneKnife,
        shield: items.woodenShield,
        accessory: null
      },
      inventory: [
        {...items.bread, quantity: 3},
        {...items.apple, quantity: 3},
        ...Array(14).fill(null)
      ]
    };
  }
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: loadInitialState(),
  reducers: {
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addItemToInventory: (state, action) => {
      const emptyIndex = state.inventory.findIndex(item => item === null);
      if (emptyIndex !== -1) {
        state.inventory[emptyIndex] = action.payload;
      }
    },
    updateInventorySize: (state, action) => {
      const newSize = action.payload;
      const resizedInventory = new Array(newSize).fill(null);
      state.inventory.forEach((item, index) => {
        if (index < newSize) {
          resizedInventory[index] = item;
        }
      });
      state.inventory = resizedInventory;
      state.stats.maxInventorySlots = newSize;
    },
    equipItem: (state, action) => {
      const { slot, item } = action.payload;
      state.equipment[slot] = item;
    },
    removeItemFromInventory: (state, action) => {
      state.inventory = state.inventory.map(item => item && item.id === action.payload ? null : item);
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      action => action.type.startsWith('player/'),
      (state, action) => {
        localStorage.setItem('playerState', JSON.stringify(state));
      }
    );
  }
});

export const { updateStats, addItemToInventory, updateInventorySize, equipItem, removeItemFromInventory } = playerSlice.actions;

export default playerSlice.reducer;
