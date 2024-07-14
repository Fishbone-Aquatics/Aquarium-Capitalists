// src/features/player/saveState.js
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      player: {
        stats: state.player.stats,
        inventory: state.player.inventory,
        equipment: state.player.equipment,
        skills: state.player.skills,
        status: state.player.status,
        skillBoostPercent: state.player.skillBoostPercent,
        gatheringSpeed: state.player.gatheringSpeed,
        gatheringEfficiency: state.player.gatheringEfficiency,
        expeditionSpeed: state.player.expeditionSpeed,
        maxInventorySlots: state.player.maxInventorySlots
      },
      aquarium: {
        maxShopSize: state.aquarium.maxShopSize
      }
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
