// Define all your items here
const items = {
    boneKnife: {
      id: 'bone-knife',
      name: "Bone Knife",
      type: "Weapon",
      image: "/icons/bone-knife.svg",
      statChanges: {
        strength: 0,
      },
    },
    luckyPig: {
      id: 'luckyPig',
      name: "Lucky Pig",
      type: "Consumable",
      image: "/icons/luckypig.svg",
      description: "A lucky charm that increases your luck for 30 minutes.",
      duration: "30 minutes",
      statChanges: {
        luck: 2,
      },
    },
    treasureScanner: {
      id: 'treasureScanner',
      name: "Treasure Scanner",
      type: "Tool",
      image: "/icons/treasurescanner.svg",
      description: "Expedition drop rate increased by 5%",
      statChanges: {
        "dropChance": 5,
      }
    },
    boostAccelerator: {
      id: 'boostAccelerator',
      name: "Accelerator",
      type: "Equipment",
      stackLimit: 10,
      image: "/icons/boostAccelerator.svg",
      description: "Increases speed of Expeditions by 2%",
      statChanges: {
        "speed": 2,
      }
    },
    filter: {
      id: 'apple',
      name: "Apple",
      type: "Food",
      heal: 2,
      stack_size: 10,
      image: "/icons/apple.svg",
      statChanges: {}
    },
    heater: {
      id: 'apple',
      name: "Apple",
      type: "Food",
      heal: 2,
      stack_size: 10,
      image: "/icons/apple.svg",
      statChanges: {}
    },
    apple: {
      id: 'apple',
      name: "Apple",
      type: "Food",
      heal: 2,
      stack_size: 10,
      image: "/icons/apple.svg",
      statChanges: {}
    }
  };
  
  export default items;
  
  // Optionally, you can create functions to handle common operations with items, such as creating inventory slots or validating items.
  