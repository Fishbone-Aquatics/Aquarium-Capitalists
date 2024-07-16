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
    totalExpeditionDuration: '0 seconds',
    currentExpeditionElapsedSeconds: 0,
    expeditionStartTime: null,
    intervalId: null,
  },
};

const expeditionSlice = createSlice({
  name: 'expedition',
  initialState,
  reducers: {
    setActiveZone: (state, action) => {
      console.log('Setting active zone:', action.payload.zoneName);
      state.activeZone = action.payload.zoneName;
      state.statistics.expeditionStartTime = Date.now();
      state.statistics.currentExpeditionElapsedSeconds = 0;
    },
    clearActiveZone: (state) => {
      console.log('Clearing active zone');
      state.activeZone = null;
      if (state.statistics.intervalId) {
        clearInterval(state.statistics.intervalId);
        console.log('Interval cleared:', state.statistics.intervalId);
      }
      state.statistics.intervalId = null;
      state.statistics.currentExpeditionElapsedSeconds = 0;
    },
    resetStatistics: (state) => {
      state.statistics = {
        expeditionsCompleted: 0,
        totalCurrency: 0,
        currencyPerHour: 0,
        totalXp: 0,
        xpPerHour: 0,
        lootedItems: [],
        totalExpeditionDuration: '0 seconds',
        currentExpeditionElapsedSeconds: 0,
        expeditionStartTime: null,
        intervalId: null,
      };
    },
    updateStatistics: (state, action) => {
      const { expeditionsCompleted, totalCurrency, currencyPerHour, totalXp, xpPerHour, lootedItems, totalExpeditionDuration } = action.payload;
      console.log('Updating statistics:', action.payload);
      state.statistics = {
        ...state.statistics,
        expeditionsCompleted,
        totalCurrency,
        currencyPerHour,
        totalXp,
        xpPerHour,
        lootedItems,
        totalExpeditionDuration,
      };
    },
    calculatetotalExpeditionDuration: (state) => {
      const now = Date.now();
      const startTime = state.statistics.expeditionStartTime;
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

      state.statistics.totalExpeditionDuration = formattedDuration;
      saveState({ player: state.player, expedition: state, aquarium: state.aquarium });
    },
    setIntervalId: (state, action) => {
      console.log('Setting interval ID:', action.payload);
      state.statistics.intervalId = action.payload;
    },
    incrementcurrentExpeditionElapsedSeconds: (state) => {
      state.statistics.currentExpeditionElapsedSeconds += 1;
    },
  },
});

export const { setActiveZone, clearActiveZone, resetStatistics, updateStatistics, calculatetotalExpeditionDuration, setIntervalId, incrementcurrentExpeditionElapsedSeconds } = expeditionSlice.actions;

export const handleExpedition = () => (dispatch, getState) => {
  const state = getState();
  const { activeZone, statistics: { intervalId } } = state.expedition;

  if (!activeZone || intervalId) return;

  const selectedZone = state.expedition.zones.find(zone => zone.name === activeZone);
  const totalDuration = selectedZone.duration;

  const interval = setInterval(() => {
    dispatch(incrementcurrentExpeditionElapsedSeconds());
    const updatedState = getState();
    const { statistics: { currentExpeditionElapsedSeconds } } = updatedState.expedition;
    const progress = (currentExpeditionElapsedSeconds / totalDuration) * 100;
    console.log(`Elapsed seconds: ${currentExpeditionElapsedSeconds}, Total duration: ${totalDuration}, Progress: ${progress}%`);

    if (currentExpeditionElapsedSeconds >= totalDuration) {
      clearInterval(interval);
      dispatch(setIntervalId(null));
      console.log('Expedition completed for zone:', activeZone);

      // Handle expedition completion
      const xp = Math.floor(Math.random() * (selectedZone.xpRange[1] - selectedZone.xpRange[0] + 1)) + selectedZone.xpRange[0];
      dispatch(addXp(xp));
      console.log('XP earned:', xp);

      const totalChance = selectedZone.lootDrops.reduce((total, drop) => total + drop.chance, 0);
      const randomChance = Math.random() * totalChance;

      let cumulativeChance = 0;
      const selectedDrop = selectedZone.lootDrops.find(drop => {
        cumulativeChance += drop.chance;
        return randomChance <= cumulativeChance;
      });

      let currencyEarned = 0;
      if (selectedDrop) {
        if (selectedDrop.type === 'item') {
          dispatch(addItemToInventory({ item: selectedDrop.item }));
          console.log('Item looted:', selectedDrop.item.name);
        } else if (selectedDrop.type === 'currency') {
          currencyEarned = randomNumberInRange(selectedDrop.amountRange[0], selectedDrop.amountRange[1]);
          dispatch(addCurrency(currencyEarned));
          console.log('Currency looted:', currencyEarned);
        }
      }

      // Calculate expedition duration
      dispatch(calculatetotalExpeditionDuration());

      // Calculate XP and currency per hour
      const updatedStateAfterCompletion = getState().expedition;
      const durationSeconds = Math.floor((Date.now() - updatedStateAfterCompletion.statistics.expeditionStartTime) / 1000);
      const durationHours = durationSeconds / 3600;
      const xpPerHour = durationHours > 0 ? Math.floor(updatedStateAfterCompletion.statistics.totalXp / durationHours) : 0;
      const currencyPerHour = durationHours > 0 ? Math.floor(updatedStateAfterCompletion.statistics.totalCurrency / durationHours) : 0;

      // Update statistics
      const statistics = {
        expeditionsCompleted: updatedStateAfterCompletion.statistics.expeditionsCompleted + 1,
        totalCurrency: updatedStateAfterCompletion.statistics.totalCurrency + currencyEarned,
        currencyPerHour,
        totalXp: updatedStateAfterCompletion.statistics.totalXp + xp,
        xpPerHour,
        lootedItems: selectedDrop?.type === 'item' ? [...updatedStateAfterCompletion.statistics.lootedItems, selectedDrop.item] : updatedStateAfterCompletion.statistics.lootedItems,
        totalExpeditionDuration: updatedStateAfterCompletion.statistics.totalExpeditionDuration,
      };
      console.log('Updating statistics with:', statistics);
      dispatch(updateStatistics(statistics));

      setTimeout(() => {
        dispatch(setActiveZone({ zoneName: activeZone }));
        dispatch(handleExpedition());
      }, 1000); // Delay of 1 second before restarting
    }
  }, 1000);

  dispatch(setIntervalId(interval));
};

export const selectcurrentExpeditionElapsedSeconds = (state) => state.expedition.statistics.currentExpeditionElapsedSeconds;

export default expeditionSlice.reducer;
