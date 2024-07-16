import { createSlice } from '@reduxjs/toolkit';
import { saveState } from '../player/saveState';
import zones from './expeditionZones';
import { addXp, addItemToInventory, addCurrency } from '../player/playerSlice';
import { randomNumberInRange } from '../../utils/randomNumberInRange';

const initialState = {
  name: "expedition",
  zones: zones,
  activeZone: null,
  statistics: {
    expeditionsCompleted: 0,
    totalCurrency: 0,
    currencyPerHour: 0,
    totalXp: 0,
    xpPerHour: 0,
    lootedItems: [],
    expeditionDuration: '0 seconds',
  },
  expeditionStartTime: null,
  intervalId: null, // Add intervalId to state
};

const expeditionSlice = createSlice({
  name: 'expedition',
  initialState,
  reducers: {
    setActiveZone: (state, action) => {
      state.activeZone = action.payload.zoneName;
      state.statistics = {
        expeditionsCompleted: 0,
        totalCurrency: 0,
        currencyPerHour: 0,
        totalXp: 0,
        xpPerHour: 0,
        lootedItems: [],
        expeditionDuration: '0 seconds',
      };
      state.expeditionStartTime = Date.now();
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
      state.expeditionStartTime = null;
      clearInterval(state.intervalId); // Clear interval
      state.intervalId = null;
    },
    updateStatistics: (state, action) => {
      const { expeditionsCompleted, totalCurrency, currencyPerHour, totalXp, xpPerHour, lootedItems } = action.payload;
      state.statistics = {
        expeditionsCompleted,
        totalCurrency,
        currencyPerHour,
        totalXp,
        xpPerHour,
        lootedItems,
        expeditionDuration: state.statistics.expeditionDuration,
      };
    },
    calculateExpeditionDuration: (state) => {
      const now = Date.now();
      const startTime = state.expeditionStartTime || now;
      const duration = Math.floor((now - startTime) / 1000);

      let formattedDuration;
      if (duration < 60) {
        formattedDuration = `${duration} seconds`;
      } else if (duration < 3600) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        formattedDuration = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
      } else {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        formattedDuration = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }

      state.statistics.expeditionDuration = formattedDuration;
      saveState({ player: state.player, expedition: state, aquarium: state.aquarium });
    },
    setIntervalId: (state, action) => {
      state.intervalId = action.payload;
    }
  },
});

export const { setActiveZone, clearActiveZone, updateStatistics, calculateExpeditionDuration, setIntervalId } = expeditionSlice.actions;

export const handleExpedition = () => (dispatch, getState) => {
  const state = getState();
  const { activeZone, intervalId } = state.expedition;

  if (!activeZone || intervalId) return;

  const selectedZone = state.expedition.zones.find(zone => zone.name === activeZone);
  const totalDuration = selectedZone.duration;

  let elapsedSeconds = 0;
  const interval = setInterval(() => {
    elapsedSeconds += 1;
    const progress = (elapsedSeconds / totalDuration) * 100;

    // Dispatch updateProgress action to update the progress bar if needed
    // dispatch(updateProgress(progress));

    if (elapsedSeconds >= totalDuration) {
      clearInterval(interval);
      dispatch(setIntervalId(null));

      // Handle expedition completion
      const xp = Math.floor(Math.random() * (selectedZone.xpRange[1] - selectedZone.xpRange[0] + 1)) + selectedZone.xpRange[0];
      dispatch(addXp(xp));

      const totalChance = selectedZone.lootDrops.reduce((total, drop) => total + drop.chance, 0);
      const randomChance = Math.random() * totalChance;

      let cumulativeChance = 0;
      const selectedDrop = selectedZone.lootDrops.find(drop => {
        cumulativeChance += drop.chance;
        return randomChance <= cumulativeChance;
      });

      if (selectedDrop) {
        if (selectedDrop.type === 'item') {
          dispatch(addItemToInventory({ item: selectedDrop.item }));
        } else if (selectedDrop.type === 'currency') {
          const amount = randomNumberInRange(selectedDrop.amountRange[0], selectedDrop.amountRange[1]);
          dispatch(addCurrency(amount));
        }
      }

      // Update statistics and restart expedition
      dispatch(updateStatistics({ ...state.expedition.statistics }));
      dispatch(handleExpedition()); // Restart expedition
    }
  }, 1000);

  dispatch(setIntervalId(interval));
};

export default expeditionSlice.reducer;
