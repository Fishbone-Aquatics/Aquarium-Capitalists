export const saveState = (state) => {
  try {
    console.log('Saving state:', JSON.parse(JSON.stringify(state))); // Deep clone for better logging

    const playerState = state.player;

    // Check if playerState or playerState.stats is undefined
    if (!playerState) {
      throw new Error('playerState is undefined');
    }
    if (!playerState.stats) {
      throw new Error('playerState.stats is undefined');
    }

    const serializedState = JSON.stringify({
      player: {
        stats: playerState.stats,
        inventory: playerState.inventory,
        equipment: playerState.equipment,
        skills: playerState.skills,
        status: playerState.status,
        skillBoostPercent: playerState.skillBoostPercent,
        gatheringSpeed: playerState.gatheringSpeed,
        gatheringEfficiency: playerState.gatheringEfficiency,
        expeditionSpeed: playerState.expeditionSpeed,
        maxInventorySlots: playerState.maxInventorySlots,
      },
      aquarium: state.aquarium ? {
        maxShopSize: state.aquarium.maxShopSize,
        items: state.aquarium.items,
        gridItems: state.aquarium.gridItems,
      } : {}, // Provide an empty object if state.aquarium is undefined
      expedition: state.expedition || {}, // Handle expedition state if it exists
    });

    localStorage.setItem('gameState', serializedState);
  } catch (e) {
    console.error('Error saving state:', e);
    console.log('State at error:', JSON.parse(JSON.stringify(state))); // Log the state at the point of error
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('gameState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Error loading state:', e);
    return undefined;
  }
};
