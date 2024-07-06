import { createSlice } from '@reduxjs/toolkit';
import items from '../../data/items';

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
      ],
      activeZone: null // Add activeZone to initial state
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
      if (item && item.id) {
        const equipmentType = slot.toLowerCase(); 
        if (item.type.toLowerCase() === equipmentType) {
          const currentItem = state.equipment[slot];
          if (currentItem && currentItem.statChanges) {
            for (const [stat, value] of Object.entries(currentItem.statChanges)) {
              state.stats[stat] -= value;
            }
          }
          state.equipment[slot] = item;
          if (item.statChanges) {
            for (const [stat, value] of Object.entries(item.statChanges)) {
              state.stats[stat] += value;
            }
          }
          state.inventory = state.inventory.map(it => it && it.id === item.id ? null : it);
          if (currentItem) {
            const emptyIndex = state.inventory.findIndex(it => it === null);
            if (emptyIndex !== -1) {
              state.inventory[emptyIndex] = currentItem;
            } else {
              console.log('Inventory full. Cannot add item:', currentItem.name);
            }
          }
          console.log('Equipped:', item.name, 'in slot:', slot, 'with item id:', item.id);
        } else {
          console.log(`Cannot equip ${item.name} in ${slot}. Item type does not match slot type.`);
        }
      }
    },    
    unequipItem: (state, action) => {
      const { slot } = action.payload;
      if (state.equipment[slot]) {
        const item = state.equipment[slot];
        state.equipment[slot] = null;
        if (item.statChanges) {
          for (const [stat, value] of Object.entries(item.statChanges)) {
            state.stats[stat] -= value;
          }
        }
        const emptyIndex = state.inventory.findIndex(it => it === null);
        if (emptyIndex !== -1) {
          state.inventory[emptyIndex] = item;
        } else {
          console.log('Inventory full. Cannot add item:', item.name);
        }
      }
    },
    swapItems: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.equipment[from];
      state.equipment[from] = state.equipment[to];
      state.equipment[to] = temp;
      if (state.equipment[from]) {
        state.inventory.push(state.equipment[from]);
        state.equipment[from] = null;
      }
    },
    setActiveZone: (state, action) => {
      state.activeZone = action.payload;
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
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

export const { updateStats, addItemToInventory, updateInventorySize, equipItem, removeItemFromInventory, unequipItem, swapItems, setActiveZone, clearActiveZone } = playerSlice.actions;

export default playerSlice.reducer;
