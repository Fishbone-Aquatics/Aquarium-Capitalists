import items from '../../data/items/items';
import { saveState } from './saveState'; // Import the shared saveState function

export const playerReducers = {
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
    console.log('Adding item to inventory', action.payload)
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
// New reducers for skills and other properties
updateSkillXp: (state, action) => {
  console.log('Updating skill xp', action.payload);
  const { skill, xp } = action.payload;
  console.log('Skill:', skill, 'XP:', xp);

  if (skill in state.skills) {
    const skillObject = state.skills[skill];
    if (skillObject) {
      skillObject.xp += xp;
      console.log(`Added ${xp} XP to ${skill}. New XP: ${skillObject.xp}`);
      // Optionally handle leveling up logic here
    } else {
      console.warn(`Skill object for ${skill} not found.`);
    }
  } else {
    console.warn(`Skill ${skill} does not exist in state.skills.`);
  }

  saveState(state);
},

updateSkillBoostPercent: (state, action) => {
  state.skillBoostPercent = action.payload;
  console.log(`Updated skill boost percent to: ${state.skillBoostPercent}`);
  saveState(state);
},
updateGatheringSpeed: (state, action) => {
  state.gatheringSpeed = action.payload;
  console.log(`Updated gathering speed to: ${state.gatheringSpeed}`);
  saveState(state);
},
updateGatheringEfficiency: (state, action) => {
  state.gatheringEfficiency = action.payload;
  console.log(`Updated gathering efficiency to: ${state.gatheringEfficiency}`);
  saveState(state);
},
updateExpeditionSpeed: (state, action) => {
  state.expeditionSpeed = action.payload;
  console.log(`Updated expedition speed to: ${state.expeditionSpeed}`);
  saveState(state);
},
};

export default playerReducers;
