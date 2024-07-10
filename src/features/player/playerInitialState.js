import items from '../../data/items/items';
export const loadInitialState = () => ({
  name: 'player',
  stats: {
    xp: 0,
    currency: 0,
    level: 1,
  },
  inventory: new Array(10).fill({ ...items.equipment.emptySlot }),
  equipment: {
    head: { ...items.equipment.emptySlot },
    body: { ...items.equipment.emptySlot },
    legs: { ...items.equipment.emptySlot },
    feet: { ...items.equipment.emptySlot },
    weapon: { ...items.equipment.emptySlot },
  },
  status: 'idle',
  skills: {
    gathering: {
      level: 1,
      xp: 0,
    },
  },
  skillBoostPercent: 0,
  gatheringSpeed: 1,
  gatheringEfficiency: 1,
  expeditionSpeed: 1,
  maxInventorySlots: 10
});
