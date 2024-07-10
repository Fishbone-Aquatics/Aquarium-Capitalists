// playerInitialState.js
import deepmerge from 'deepmerge';
import items from '../../data/items/items';

const loadInitialState = () => {
  const initialState = {
    name: 'player',
    stats: {
      xp: 0,
      currency: 0,
      level: 1,
    },
    inventory: new Array(10).fill({ ...items.equipment.emptySlot }),
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
