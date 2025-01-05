export const saveState = (state) => {
  try {
    const now = new Date().toISOString(); // Capture the current timestamp

    // Perform deep cloning of state objects to avoid immutability issues
    const playerState = JSON.parse(JSON.stringify(state.player || {}));
    const expeditionState = JSON.parse(JSON.stringify(state.expedition || {}));
    const aquariumState = JSON.parse(JSON.stringify(state.aquarium || {}));
    const gatheringState = JSON.parse(JSON.stringify(state.gathering || {}));

    // Ensure stats and statistics exist
    playerState.stats = playerState.stats || {};
    expeditionState.statistics = expeditionState.statistics || {};
    expeditionState.statistics.totalExpeditionDuration =
      expeditionState.statistics.totalExpeditionDuration || '0 seconds';

    // Cap `currentExpeditionElapsedSeconds` to the total duration
    if (expeditionState.activeZone) {
      const zone = expeditionState.zones.find(z => z.name === expeditionState.activeZone);
      if (zone) {
        const maxDuration = zone.duration;
        expeditionState.statistics.currentExpeditionElapsedSeconds = Math.min(
          expeditionState.statistics.currentExpeditionElapsedSeconds,
          maxDuration
        );
      }
    }

    // Update the lastAction timestamp
    playerState.lastAction = now;

    // Serialize the state
    const serializedState = JSON.stringify({
      player: {
        name: playerState.name,
        stats: playerState.stats,
        inventory: playerState.inventory,
        equipment: playerState.equipment,
        skills: {
          expedition: expeditionState || {},
          gathering: gatheringState || {},
        },
        maxInventorySlots: playerState.maxInventorySlots,
        lastAction: playerState.lastAction, 
        currentTaskState: playerState.currentTaskState,

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
          totalExpeditionDuration: expeditionState.statistics.totalExpeditionDuration
        },
      },
      gathering: {
        activeResource: gatheringState.activeResource,
        gatheringStartTime: gatheringState.gatheringStartTime,
      },
    });

    // Save to localStorage
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