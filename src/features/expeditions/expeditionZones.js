//expeditionZones.js
import items from '../../data/items/items';

const zones = [
  {
    name: 'Coral Reefs',
    description: 'Rich in colorful fish and rare coral species.',
    duration: 10, // seconds
    xpRange: [15, 25],
    lootDrops: [
      { type: 'item', item: items.equipment.filter, dropRate: '1:10' },
      { type: 'item', item: items.equipment.spongeFilter, dropRate: '1:100' },
      { type: 'item', item: items.equipment.light, dropRate: '1:500' },
      { type: 'item', item: items.equipment.heater, dropRate: '1:200' },
      { type: 'currency', amountRange: [5, 10], dropRate: 'always' },
    ],
    image: 'icons/expeditions/coralReef.png',
  },
  {
    name: 'Shipwrecks',
    description: 'Chance to find hidden treasures and ancient artifacts.',
    duration: 30, // seconds
    xpRange: [3, 5],
    lootDrops: [
      { type: 'item', item: items.equipment.filter, dropRate: '1:10000' },
      { type: 'currency', amountRange: [5, 10], dropRate: '1:5' },
    ],
    image: 'icons/expeditions/shipwreck.png',
  },
  {
    name: 'Deep Sea Trenches',
    description: 'Home to exotic and rare deep-sea creatures.',
    duration: 45, // seconds
    xpRange: [4, 7],
    lootDrops: [
      { type: 'item', item: items.equipment.filter, dropRate: '1:10000' },
      { type: 'currency', amountRange: [5, 10], dropRate: '1:5' },
    ],
    image: 'icons/expeditions/trench.png',
  },
  {
    name: 'Underwater Caves',
    description: 'Potential for discovering unique plant species and minerals.',
    duration: 60, // seconds
    xpRange: [5, 10],
    lootDrops: [
      { type: 'item', item: items.equipment.filter, dropRate: '1:10000' },
      { type: 'currency', amountRange: [5, 10], dropRate: '1:5' },
    ],
    image: 'icons/expeditions/underwaterCave.png',
  },
];

export default zones;
