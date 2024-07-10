const equipment = {
  emptySlot: {
    id: 'empty-slot',
    name: "Empty Slot",
    category: "Equipment",
    image: "/icons/equipment/empty.png",
    description: "An item slot with nothing equipped.",
    stackLimit: 1,
    statChanges: {},
    tooltip: {
      name: 'Empty Slot',
      type: 'Slot',
      description: 'An item slot with nothing equipped.',
      id: 'empty-slot',
    }
  },
  spongeFilter: {
    id: 'sponge-filter',
    name: "Sponge Filter",
    type: "Filter",
    category: "Equipment",
    image: "/icons/equipment/spongeFilter.png",
    description: "An essential aquarium filter for shrimp.",
    statChanges: {},
    tooltip: {
      name: 'Sponge Filter',
      type: 'Filter',
      description: 'An essential aquarium filter for shrimp.',
      id: 'sponge-filter',
    }
  },
  filter: {
    id: 'filter',
    name: "Filter",
    type: "Filter",
    category: "Equipment",
    image: "/icons/equipment/filter.png",
    description: "An essential hang on back aquarium filter.",
    statChanges: {},
    tooltip: {
      name: 'Filter',
      type: 'Filter',
      description: 'An essential hang on back aquarium filter.',
      id: 'filter',
    },
  },
  largeFilter: {
    id: 'large-filter',
    name: "Large Filter",
    type: "Filter",
    category: "Equipment",
    image: "/icons/equipment/filter.png",
    description: "An extremely large canister aquarium filter.",
    statChanges: {},
    tooltip: {
      name: 'Large Filter',
      type: 'Filter',
      description: 'An extremely large canister aquarium filter.',
      id: 'large-filter',
    }
  },
  canisterFilter: {
    id: 'canister-filter',
    name: "Canister Filter",
    type: "Filter",
    category: "Equipment",
    image: "/icons/equipment/canisterFilter.png",
    description: "An essential canister back aquarium filter.",
    statChanges: {},
    tooltip: {
      name: 'Canister Filter',
      type: 'Filter',
      description: 'An essential canister back aquarium filter.',
      id: 'canister-filter',
    }
  },
  heater: {
    id: 'heater',
    name: "Heater",
    type: "Heater",
    category: "Equipment",
    image: "/icons/equipment/heater.png",
    description: "An essential aquarium heater.",
    stackLimit: 1,
    statChanges: {},
    tooltip: {
      name: 'Heater',
      type: 'Heater',
      description: 'An essential aquarium heater.',
      id: 'heater',
    },
  },
  boostAccelerator: {
    id: 'boost-accelerator',
    name: "Boost Accelerator",
    type: "Booster",
    category: "Equipment",
    stackLimit: 10,
    image: "/icons/equipment/boostAccelerator.png",
    description: "Increases speed of Expeditions by 2%",
    statChanges: {
      speed: 2,
    },
    tooltip: {
      name: 'Boost Accelerator',
      type: 'Booster',
      description: 'Increases speed of Expeditions by 2%',
      id: 'boost-accelerator',
      statChanges: {
        speed: 2,
      },
    },
  },
  treasureScanner: {
    id: 'treasure-scanner',
    name: "Treasure Scanner",
    type: "Tool",
    category: "Equipment",
    image: "/icons/equipment/treasurescanner.png",
    description: "Expedition drop rate increased by 5%",
    statChanges: {
      dropChance: 5,
    },
    tooltip: {
      name: 'Treasure Scanner',
      type: 'Tool',
      description: 'Expedition drop rate increased by 5%',
      id: 'treasure-scanner',
      statChanges: {
        dropChance: 5,
      },
    },
  },
  light: {
    id: 'light',
    name: "Light",
    type: "Light",
    category: "Equipment",
    image: "/icons/equipment/light.png",
    description: "A light for your aquarium.",
    statChanges: {
      aquariumMaxLightStrength: 5,
    },
    tooltip: {
      name: "Light",
      type: 'Light',
      description: 'A light for your aquarium.',
      id: 'light',
      statChanges: {
        aquariumMaxLightStrength: 5,
      },
    }
  },
};

export default equipment;
