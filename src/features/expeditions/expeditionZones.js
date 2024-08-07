//expeditionZones.js
import items from '../../data/items/items';

const zones = [
  {
    name: 'Coral Reefs',
    description: 'Rich in colorful fish and rare coral species.',
    duration: 10, // seconds
    minLevel: 1,
    xpRange: [15, 25],
    lootDrops: [
      { type: 'item', item: items.resource.driftwood, dropRate: '1:10' },
      { type: 'item', item: items.resource.treasurechest, dropRate: '1:180' },
      { type: 'item', item: items.equipment.filter, dropRate: '1:500' },
      { type: 'item', item: items.equipment.spongeFilter, dropRate: '1:1000' },
      { type: 'currency', amountRange: [5, 10], dropRate: 'always' },
    ],
    image: 'icons/expeditions/coralReef.png',
  },
  {
    name: 'Shipwrecks',
    description: 'Chance to find hidden treasures and ancient artifacts.',
    duration: 30, // seconds
    minLevel: 5,
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
    minLevel: 10,
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
    minLevel: 15,
    xpRange: [5, 10],
    lootDrops: [
      { type: 'item', item: items.equipment.filter, dropRate: '1:10000' },
      { type: 'currency', amountRange: [5, 10], dropRate: '1:5' },
    ],
    image: 'icons/expeditions/underwaterCave.png',
  },
];

export default zones;
