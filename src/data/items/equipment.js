// TODO: Add R.O machine.

const equipment = {
    emptySlot: {
      id: 'empty-slot',
      name: "Empty Slot",
      category: "Equipment",
      image: "/icons/equipment/empty.png",
      description: "An item slot with nothing equipped.",
      statChanges: {}
    },
      spongeFilter: {
      id: 'sponge-filter',
      name: "Sponge Filter",
      type: "Filter",
      category: "Equipment",
      image: "/icons/equipment/spongeFilter.png",
      description: "An essential aquarium filter for shrimp.",
      statChanges: {}
    },
    filter: {
      id: 'filter',
      name: "Filter",
      type: "Filter",
      category: "Equipment",
      image: "/icons/equipment/filter.png",
      description: "An essential hang on back aquarium filter.",
      statChanges: {}
    },
    largeFilter: {
      id: 'large-filter',
      name: "Large Filter",
      type: "Filter",
      category: "Equipment",
      image: "/icons/equipment/filter.png",
      description: "An extremely large canister aquarium filter.",
      statChanges: {}
    },
    canisterFilter: {
      id: 'canister-filter',
      name: "Canister Filter",
      type: "Filter",
      category: "Equipment",
      image: "/icons/equipment/canisterFilter.png",
      description: "An essential canister back aquarium filter.",
      statChanges: {}
    },
    heater: {
      id: 'heater',
      name: "Heater",
      type: "Heater",
      category: "Equipment",
      image: "/icons/equipment/heater.png",
      description: "An essential aquarium heater.",
      statChanges: {}
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
      }
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
      }
    },
    light: {
      id: 'light',
      name: "Light",
      type: "Light",
      category: "Equipment",
      image: "/icons/equipment/light.png",
      description: "A light for your aquarium.",
      statChanges: {
        //aquariumMaxLightStrength: 5,
      }
    },
  };
  
  export default equipment;
  