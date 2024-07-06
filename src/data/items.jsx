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
    katana: {
      id: 'katana',
      name: "Katana",
      type: "Weapon",
      image: "/icons/katana.svg",
      statChanges: {
        strength: 2,
      },
    },
    woodenShield: {
      id: 'basic-armor',
      name: "Basic Armor",
      type: "Armor",
      image: "/icons/armor.svg",
      statChanges: {}
    },
    bread: {
      id: 'bread',
      name: "Bread",
      type: "Food",
      heal: 5,
      stack_size: 10,
      image: "/icons/bread.svg",
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
  