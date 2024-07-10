// src/features/player/saveState.js
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      stats: state.stats,
      inventory: state.inventory,
      equipment: state.equipment,
      skills: state.skills,
      status: state.status,
      skillBoostPercent: state.skillBoostPercent,
      gatheringSpeed: state.gatheringSpeed,
      gatheringEfficiency: state.gatheringEfficiency,
      expeditionSpeed: state.expeditionSpeed,
      maxInventorySlots: state.maxInventorySlots
    });
    localStorage.setItem('playerState', serializedState);
  } catch (e) {
    console.warn('Error saving state:', e);
  }
};
