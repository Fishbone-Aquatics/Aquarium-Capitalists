// src/features/player/playerReducers.js
import items from '../../data/items/items';
import { saveState } from './saveState'; // Import the shared saveState function

const playerReducers = {
  updateStats: (state, action) => {
    state.stats = { ...state.stats, ...action.payload };
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  addXp: (state, action) => {
    state.stats.xp += action.payload;
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  addCurrency: (state, action) => {
    state.stats.currency += action.payload;
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  startExpedition: (state) => {
    state.expeditionStartTime = Date.now();
    state.status = 'exploring';
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  stopExpedition: (state) => {
    state.status = 'idle';
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  addItemToInventory: (state, action) => {
    const { item } = action.payload;
    const existingItem = state.inventory.find(i => i.id === item.id);

    if (existingItem && (!item.stackLimit || existingItem.quantity < item.stackLimit)) {
      existingItem.quantity += item.quantity || 1;
    } else {
      const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
      if (emptyIndex !== -1) {
        state.inventory[emptyIndex] = { ...item, quantity: item.quantity || 1 };
      } else {
        console.log('Inventory full. Cannot add item:', item.name);
      }
    }

    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  removeItemFromInventory: (state, action) => {
    const { itemId } = action.payload;
    state.inventory = state.inventory.map(item => item && item.id === itemId ? { ...items.equipment.emptySlot } : item);
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
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
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  equipItem: (state, action) => {
    const { item, slot } = action.payload;
    if (item && item.id) {
      const equipmentType = slot.toLowerCase();
      if (item.type.toLowerCase() === equipmentType) {
        const currentItem = { ...state.equipment[slot] };
        state.equipment[slot] = { ...item, isEquipmentSlot: true };
        state.inventory = state.inventory.map(it => it && it.id === item.id ? { ...items.equipment.emptySlot } : it);

        if (currentItem && currentItem.id !== items.equipment.emptySlot.id) {
          const emptyIndex = state.inventory.findIndex(it => it.id === items.equipment.emptySlot.id);
          if (emptyIndex !== -1) {
            state.inventory[emptyIndex] = { ...currentItem, isEquipmentSlot: false };
          } else {
            state.inventory.push({ ...currentItem, isEquipmentSlot: false });
          }
        }
      } else {
        console.log(`Cannot equip ${item.name} in ${slot}. Item type does not match slot type. ${item.type}`);
      }
    }
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  unequipItem: (state, action) => {
    const { slot, targetIndex } = action.payload;
    const currentItem = { ...state.equipment[slot] };

    if (currentItem && currentItem.id !== items.equipment.emptySlot.id) {
      const targetItem = state.inventory[targetIndex];

      if (targetItem.id === items.equipment.emptySlot.id || targetItem.type === currentItem.type) {
        state.equipment[slot] = { ...items.equipment.emptySlot, type: slot.charAt(0).toUpperCase() + slot.slice(1) };
        state.inventory[targetIndex] = { ...currentItem, isEquipmentSlot: false };
      } else {
        console.error('Cannot swap items of different types');
      }
    } else {
      console.error('Current item is empty slot or invalid', currentItem);
    }
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  swapItems: (state, action) => {
    const { from, to } = action.payload;

    if (typeof from === 'number' && typeof to === 'number' && from < state.inventory.length && to < state.inventory.length) {
      const fromItem = { ...state.inventory[from] };
      const toItem = { ...state.inventory[to] };

      if (fromItem && toItem) {
        state.inventory[from] = toItem;
        state.inventory[to] = fromItem;
      } else {
        console.error("Invalid swap operation:", { fromItem, toItem });
      }
    } else {
      console.error("Invalid swap indices:", { from, to });
    }
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  swapEquipmentAndInventory: (state, action) => {
    const { fromInventoryIndex, toEquipmentSlot } = action.payload;
    const fromItem = state.inventory[fromInventoryIndex];
    const toItem = state.equipment[toEquipmentSlot];

    if (fromItem && toItem) {
      if (fromItem.type === toItem.type) {
        state.inventory[fromInventoryIndex] = { ...toItem, isEquipmentSlot: false };
        state.equipment[toEquipmentSlot] = { ...fromItem, isEquipmentSlot: true };
      } else {
        console.error('Cannot swap items of different types');
      }
    } else {
      console.error("Invalid swap operation:", { fromItem, toItem });
    }
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  swapInventoryAndEquipment: (state, action) => {
    const { fromEquipmentSlot, toInventoryIndex } = action.payload;
    const fromItem = state.equipment[fromEquipmentSlot];
    const toItem = state.inventory[toInventoryIndex];

    if (fromItem && toItem) {
      if (fromItem.type === toItem.type || toItem.id === items.equipment.emptySlot.id) {
        state.equipment[fromEquipmentSlot] = { ...toItem, isEquipmentSlot: true };
        state.inventory[toInventoryIndex] = { ...fromItem, isEquipmentSlot: false };
      } else {
        console.error('Cannot swap items of different types');
      }
    } else {
      console.error("Invalid swap operation:", { fromItem, toItem });
    }
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  setEquipmentFlag: (state, action) => {
    const { index, isEquipmentSlot } = action.payload;
    const item = state.inventory[index] || state.equipment[index];
    if (item) {
      item.isEquipmentSlot = isEquipmentSlot;
    }
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  updateSkillXp: (state, action) => {
    const { skill, xp } = action.payload;

    if (skill in state.skills) {
      const skillObject = state.skills[skill];
      if (skillObject) {
        skillObject.xp += xp;
      }
    }

    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  updateSkillBoostPercent: (state, action) => {
    state.skillBoostPercent = action.payload;
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  updateGatheringSpeed: (state, action) => {
    state.gatheringSpeed = action.payload;
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  updateGatheringEfficiency: (state, action) => {
    state.gatheringEfficiency = action.payload;
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
  updateExpeditionSpeed: (state, action) => {
    state.expeditionSpeed = action.payload;
    saveState({ player: state, expedition: state.expedition, aquarium: state.aquarium });
  },
};

export default playerReducers;
