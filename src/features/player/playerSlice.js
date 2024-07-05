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
        {...items.katana, quantity: 1},
        ...Array(13).fill(null)
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
      const { item } = action.payload;
      const emptyIndex = state.inventory.findIndex(it => it === null);
      if (emptyIndex !== -1) {
        state.inventory[emptyIndex] = item;
      } else {
        console.log('Inventory full. Cannot add item:', item.name);
        // Optionally handle full inventory scenario
      }
    },
    removeItemFromInventory: (state, action) => {
      const { itemId } = action.payload;
      state.inventory = state.inventory.map(item => item && item.id === itemId ? null : item);
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
      const { item, slot } = action.payload;
    
      // Check if item is valid and has an id property
      if (item && item.id) {
        const equipmentType = slot.toLowerCase(); // Adjust slot name to match item type (e.g., 'weapon' for 'Weapon')
    
        // Check if the item type matches the equipment slot
        if (item.type.toLowerCase() === equipmentType) {
          // Check if the slot is currently empty
          if (!state.equipment[slot]) {
            // Equip the item directly if the slot is empty
            state.equipment[slot] = item;
            console.log('Equipped:', item.name, 'in slot:', slot, 'with item id:', item.id);
    
            // Remove from inventory
            state.inventory = state.inventory.map(it => it && it.id === item.id ? null : it);
          } else {
            // Swap items
            const currentItem = state.equipment[slot];
            state.equipment[slot] = item;
            console.log('Equipped:', item.name, 'in slot:', slot, 'with item id:', item.id);
    
            // Find the first available slot in the inventory
            const emptyIndex = state.inventory.findIndex(it => it === null);
            if (emptyIndex !== -1) {
              state.inventory[emptyIndex - 1] = currentItem;
            } else {
              console.log('Inventory full. Cannot add item:', currentItem.name);
              // Optionally handle full inventory scenario
            }
    
            // Remove the newly equipped item from inventory
            state.inventory = state.inventory.map(it => it && it.id === item.id ? null : it);
          }
        } else {
          console.log(`Cannot equip ${item.name} in ${slot}. Item type does not match slot type.`);
        }
      }
    },    
    unequipItem: (state, action) => {
      const { slot } = action.payload;
      if (state.equipment[slot]) {
        state.inventory.push(state.equipment[slot]);
        state.equipment[slot] = null;
      }
    },
    swapItems: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.equipment[from];
      state.equipment[from] = state.equipment[to];
      state.equipment[to] = temp;

      // Move the previously equipped item from 'from' slot back to inventory
      if (state.equipment[from]) {
        state.inventory.push(state.equipment[from]);
        state.equipment[from] = null; // Clear the 'from' slot after moving the item
      }
    },
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

export const { updateStats, addItemToInventory, updateInventorySize, equipItem, removeItemFromInventory, unequipItem, swapItems } = playerSlice.actions;

export default playerSlice.reducer;
