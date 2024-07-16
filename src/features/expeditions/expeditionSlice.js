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
  intervalId: null,
};

const expeditionSlice = createSlice({
  name: 'expedition',
  initialState,
  reducers: {
    setActiveZone: (state, action) => {
      console.log('Setting active zone:', action.payload.zoneName);
      state.activeZone = action.payload.zoneName;
      state.expeditionStartTime = Date.now();
    },
    clearActiveZone: (state) => {
      console.log('Clearing active zone');
      state.activeZone = null;
      state.expeditionStartTime = null;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        console.log('Interval cleared:', state.intervalId);
      }
      state.intervalId = null;
    },
    updateStatistics: (state, action) => {
      const { expeditionsCompleted, totalCurrency, currencyPerHour, totalXp, xpPerHour, lootedItems, expeditionDuration } = action.payload;
      console.log('Updating statistics:', action.payload);
      state.statistics = {
        expeditionsCompleted,
        totalCurrency,
        currencyPerHour,
        totalXp,
        xpPerHour,
        lootedItems,
        expeditionDuration,
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
      console.log('Setting interval ID:', action.payload);
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
    console.log(`Elapsed seconds: ${elapsedSeconds}, Total duration: ${totalDuration}, Progress: ${progress}%`);

    if (elapsedSeconds >= totalDuration) {
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
      dispatch(calculateExpeditionDuration());

      // Calculate XP and currency per hour
      const updatedState = getState().expedition;
      const durationSeconds = Math.floor((Date.now() - updatedState.expeditionStartTime) / 1000);
      const durationHours = durationSeconds / 3600;
      const xpPerHour = durationHours > 0 ? Math.floor(updatedState.statistics.totalXp / durationHours) : 0;
      const currencyPerHour = durationHours > 0 ? Math.floor(updatedState.statistics.totalCurrency / durationHours) : 0;

      // Update statistics
      const statistics = {
        expeditionsCompleted: updatedState.statistics.expeditionsCompleted + 1,
        totalCurrency: updatedState.statistics.totalCurrency + currencyEarned,
        currencyPerHour,
        totalXp: updatedState.statistics.totalXp + xp,
        xpPerHour,
        lootedItems: selectedDrop?.type === 'item' ? [...updatedState.statistics.lootedItems, selectedDrop.item] : updatedState.statistics.lootedItems,
        expeditionDuration: updatedState.statistics.expeditionDuration,
      };
      console.log('Updating statistics with:', statistics);
      dispatch(updateStatistics(statistics));

      setTimeout(() => {
        dispatch(handleExpedition()); // Restart expedition after 1 second delay
      }, 1000); // Delay of 1 second before resetting
    }
  }, 1000);

  dispatch(setIntervalId(interval));
};

export default expeditionSlice.reducer;
