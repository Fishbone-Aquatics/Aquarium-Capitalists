import { createSlice } from '@reduxjs/toolkit';
import { setActiveZone, clearActiveZone } from '../expeditionSlice'; // Import actions from expeditionSlice
import items from '../../data/items/items';

const loadInitialState = () => {
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
        { ...items.equipment.filter, quantity: 1 },
        { ...items.equipment.spongeFilter, quantity: 1 },
        { ...items.equipment.light, quantity: 1 },
        ...Array(13).fill({ ...items.equipment.emptySlot }),
      ],
      status: 'idle',
      maxInventorySlots: 16,
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
    addXp: (state, action) => {
      state.stats.xp += action.payload;
    },
    addItemToInventory: (state, action) => {
      const { item } = action.payload;
      const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
      if (emptyIndex !== -1) {
        state.inventory[emptyIndex] = item;
      } else {
        console.log('Inventory full. Cannot add item:', item.name);
      }
    },
    addCurrency: (state, action) => {
      state.stats.currency += action.payload;
    },
    removeItemFromInventory: (state, action) => {
      const { itemId } = action.payload;
      state.inventory = state.inventory.map(item => item && item.id === itemId ? items.equipment.emptySlot : item);
    },
    updateInventorySize: (state, action) => {
      const newSize = action.payload;
      const resizedInventory = new Array(newSize).fill(items.equipment.emptySlot);
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
          state.inventory = state.inventory.map(it => it && it.id === item.id ? items.equipment.emptySlot : it);
          if (currentItem && currentItem.id !== items.equipment.emptySlot.id) {
            const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
            if (emptyIndex !== -1) {
              state.inventory[emptyIndex] = currentItem;
            } else {
              console.log('Inventory full. Cannot add item:', currentItem.name);
            }
          }
          console.log('Equipped:', item.name, 'in slot:', slot, 'with item id:', item.id);
        } else {
          console.log(`Cannot equip ${item.name} in ${slot}. Item type does not match slot type. ${item.type}`);
        }
      }
    },
    unequipItem: (state, action) => {
      const { slot } = action.payload;
      const currentItem = state.equipment[slot];
      if (currentItem && currentItem.id !== items.equipment.emptySlot.id) {
        state.equipment[slot] = { ...items.equipment.emptySlot, type: slot.charAt(0).toUpperCase() + slot.slice(1) };
        const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
        if (emptyIndex !== -1) {
          state.inventory[emptyIndex] = currentItem;
        } else {
          state.inventory.push(currentItem); // Ensure there's a place for unequipped items
        }
      }
    },
    swapItems: (state, action) => {
      const { from, to } = action.payload;
      const temp = state.inventory[from];
      state.inventory[from] = state.inventory[to];
      state.inventory[to] = temp;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setActiveZone, (state, action) => {
      state.status = `Exploring ${action.payload.zoneName}`;
      console.log('status should be exploring:', state.status);
    });
    builder.addCase(clearActiveZone, (state) => {
      console.log('Expedition complete. - player slice');
      state.status = 'idle';
    });
    builder.addMatcher(
      action => action.type.startsWith('player/'),
      (state) => {
        localStorage.setItem('playerState', JSON.stringify(state));
      }
    );
  }
});

export const { updateStats, addXp, addItemToInventory, addCurrency, updateInventorySize, equipItem, removeItemFromInventory, unequipItem, swapItems } = playerSlice.actions;

export default playerSlice.reducer;
