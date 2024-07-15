// src/features/player/saveState.js
export const saveState = (state) => {
  try {
    const playerState = state.player || {};
    const expeditionState = state.expedition || {};
    const aquariumState = state.aquarium || {};

    if (!playerState.stats) {
      playerState.stats = {};
    }

    if (!expeditionState.statistics) {
      expeditionState.statistics = {};
    }

    if (!expeditionState.statistics.expeditionDuration) {
      expeditionState.statistics.expeditionDuration = '0 seconds';
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
      aquarium: {
        maxShopSize: aquariumState.maxShopSize,
        items: aquariumState.items,
        gridItems: aquariumState.gridItems,
      },
      expedition: {
        ...expeditionState,
        statistics: {
          ...expeditionState.statistics,
          expeditionDuration: expeditionState.statistics.expeditionDuration,
        },
      },
    });

    localStorage.setItem('gameState', serializedState);
  } catch (e) {
    console.error('Error saving state:', e);
    console.log('State at error:', JSON.parse(JSON.stringify(state)));
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
