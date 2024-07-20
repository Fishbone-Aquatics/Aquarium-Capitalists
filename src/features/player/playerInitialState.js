// playerInitialState.js
import deepmerge from 'deepmerge';
import items from '../../data/items/items';

const initializeInventory = (initialItems, maxSlots) => {
  const inventory = new Array(maxSlots).fill({ ...items.equipment.emptySlot });

  initialItems.forEach((item, index) => {
    if (index < maxSlots) {
      inventory[index] = item;
    }
  });

  return inventory;
};

const initialItems = [
  //{ ...items.resource.treasurechest, quantity: 6 },
];

const loadInitialState = () => {
  const initialState = {
    name: 'player',
    stats: {
      xp: 0,
      currency: 0,
      level: 1,
    },
    inventory: initializeInventory(initialItems, 10),
    equipment: {
      heater: { ...items.equipment.emptySlot, type: 'Heater' },
      filter: { ...items.equipment.emptySlot, type: 'Filter' },
      light: { ...items.equipment.emptySlot, type: 'Light' },
    },
    skills: {
      gathering: {
        level: 1,
        xp: 0,
      },
    },
    status: 'idle',
    expeditionDuration: '0 seconds', 
    skillBoostPercent: 0,
    gatheringSpeed: 1,
    gatheringEfficiency: 1,
    expeditionSpeed: 1,
    maxInventorySlots: 10
  };

  const savedState = localStorage.getItem('playerState');
  if (savedState) {
    return deepmerge(initialState, JSON.parse(savedState), {
      arrayMerge: (destinationArray, sourceArray, options) => sourceArray
    });
  } else {
    return initialState;
  }
};

export default loadInitialState;
