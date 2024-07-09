import { createSlice } from '@reduxjs/toolkit';
import items from '../../data/items/items';
import { setActiveZone, clearActiveZone } from '../expeditionSlice';

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
        // heater: { ...items.equipment.filter, type: 'Heater' }, // testing
        // filter: { ...items.equipment.spongeFilter, type: 'Filter' },
        // light: { ...items.equipment.light, type: 'Light' },
        heater: { ...items.equipment.emptySlot, type: 'Heater' },
        filter: { ...items.equipment.emptySlot, type: 'Filter' },
        light: { ...items.equipment.emptySlot, type: 'Light' },
      },
      // inventory: [ // testing
      //   { ...items.equipment.filter, quantity: 1 },
      //   { ...items.equipment.spongeFilter, quantity: 1 },
      //   { ...items.equipment.light, quantity: 1 },
      //   ...Array(13).fill({ ...items.equipment.emptySlot }),
      // ],
      inventory: [
        ...Array(16).fill({ ...items.equipment.emptySlot }),
      ],
      status: 'idle',
      maxInventorySlots: 16,
    };
  }
};

const saveState = (state) => {
  localStorage.setItem('playerState', JSON.stringify(state));
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: loadInitialState(),
  reducers: {
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      saveState(state);
    },
    addXp: (state, action) => {
      state.stats.xp += action.payload;
      console.log(`Added XP: ${action.payload}, new XP: ${state.stats.xp}`);
      saveState(state);
    },
    addCurrency: (state, action) => {
      state.stats.currency += action.payload;
      console.log(`Added currency: ${action.payload}, new currency: ${state.stats.currency}`);
      saveState(state);
    },
    addItemToInventory: (state, action) => {
      console.log('adding item to inventory',)
      const { item } = action.payload;
      const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
      if (emptyIndex !== -1) {
        state.inventory[emptyIndex] = { ...item };
        console.log(`Added item: ${item.name} to inventory at index: ${emptyIndex}`);
      } else {
        console.log('Inventory full. Cannot add item:', item.name);
      }
      saveState(state);
    },
    removeItemFromInventory: (state, action) => {
      const { itemId } = action.payload;
      state.inventory = state.inventory.map(item => item && item.id === itemId ? { ...items.equipment.emptySlot } : item);
      console.log(`Removed item with id: ${itemId} from inventory`);
      saveState(state);
    },
    updateInventorySize: (state, action) => {
      const newSize = action.payload;
      const resizedInventory = new Array(newSize).fill({ ...items.equipment.emptySlot });
      state.inventory.forEach((item, index) => {
        if (index < newSize) {
          resizedInventory[index] = item;
        }
      });
      state.inventory = resizedInventory;
      state.stats.maxInventorySlots = newSize;
      console.log(`Updated inventory size to: ${newSize}`);
      saveState(state);
    },
    equipItem: (state, action) => {
      const { item, slot } = action.payload;
      if (item && item.id) {
        const equipmentType = slot.toLowerCase();
        if (item.type.toLowerCase() === equipmentType) {
          const currentItem = { ...state.equipment[slot] };
          state.equipment[slot] = { ...item };
          state.inventory = state.inventory.map(it => it && it.id === item.id ? { ...items.equipment.emptySlot } : it);

          if (currentItem && currentItem.id !== items.equipment.emptySlot.id) {
            const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
            if (emptyIndex !== -1) {
              state.inventory[emptyIndex] = { ...currentItem };
            } else {
              state.inventory.push({ ...currentItem });
            }
          }
        } else {
          console.log(`Cannot equip ${item.name} in ${slot}. Item type does not match slot type. ${item.type}`);
        }
      }
      saveState(state);
    },
    unequipItem: (state, action) => {
      const { slot, targetIndex } = action.payload;
      const currentItem = { ...state.equipment[slot] };
      if (currentItem && currentItem.id !== items.equipment.emptySlot.id) {
        state.equipment[slot] = { ...items.equipment.emptySlot, type: slot.charAt(0).toUpperCase() + slot.slice(1) };
        state.inventory[targetIndex] = currentItem;
      }
      saveState(state);
    },
    swapItems: (state, action) => {
      const { from, to } = action.payload;
      if (typeof from === 'number' && typeof to === 'number' && from < state.inventory.length && to < state.inventory.length) {
        const fromItem = state.inventory[from];
        const toItem = state.inventory[to];

        console.log("Attempting to swap items:", fromItem, toItem);

        if (fromItem && toItem) {
          state.inventory[from] = toItem;
          state.inventory[to] = fromItem;
          console.log(`Swapped items in inventory from index ${from} to index ${to}`);
        } else {
          console.error("Invalid swap operation:", { fromItem, toItem });
        }
      } else {
        console.error("Invalid swap indices:", { from, to });
      }
      saveState(state);
    },
    swapEquipmentAndInventory: (state, action) => {
      const { fromInventoryIndex, toEquipmentSlot } = action.payload;
      const fromItem = state.inventory[fromInventoryIndex];
      const toItem = state.equipment[toEquipmentSlot];

      console.log("Attempting to swap inventory item with equipment:", fromItem, toItem);

      if (fromItem && toItem) {
        state.inventory[fromInventoryIndex] = toItem;
        state.equipment[toEquipmentSlot] = fromItem;
        console.log(`Swapped inventory item at index ${fromInventoryIndex} with equipment slot ${toEquipmentSlot}`);
      } else {
        console.error("Invalid swap operation:", { fromItem, toItem });
      }
      saveState(state);
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

export const { updateStats, addXp, addCurrency, addItemToInventory, removeItemFromInventory, updateInventorySize, equipItem, unequipItem, swapItems, swapEquipmentAndInventory } = playerSlice.actions;

export default playerSlice.reducer;
