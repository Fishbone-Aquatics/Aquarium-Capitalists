// src/features/player/saveState.js
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      player: {
        stats: state.player.stats || {}, // Ensure stats are defined
        inventory: state.player.inventory || [],
        equipment: state.player.equipment || [],
        skills: state.player.skills || {},
        status: state.player.status || 'idle',
        skillBoostPercent: state.player.skillBoostPercent || 0,
        gatheringSpeed: state.player.gatheringSpeed || 1,
        gatheringEfficiency: state.player.gatheringEfficiency || 1,
        expeditionSpeed: state.player.expeditionSpeed || 1,
        maxInventorySlots: state.player.maxInventorySlots || 20,
      },
      aquarium: {
        maxShopSize: state.aquarium.maxShopSize || 10,
        items: state.aquarium.items || [],
        gridItems: state.aquarium.gridItems || [],
      },
      expedition: state.expedition || {}, // Ensure expedition state is defined
    });
    localStorage.setItem('gameState', serializedState);
  } catch (e) {
    console.warn('Error saving state:', e);
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
    console.warn('Error loading state:', e);
    return undefined;
  }
};
