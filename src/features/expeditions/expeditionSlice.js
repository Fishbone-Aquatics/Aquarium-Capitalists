import { createSlice } from '@reduxjs/toolkit';
import { saveState } from '../player/saveState';
import zones from './expeditionZones';
import { addXp, addItemToInventory, addCurrency } from '../player/playerSlice';
import { randomNumberInRange } from '../../utils/randomNumberInRange';

const initialState = {
  name: "expedition",
  zones: zones,
  activeZone: null, // string
  level: 1,
  xp: 0,
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
    activeZoneObject: null,
    expeditionIntervalId: null,
  },
};

const expeditionSlice = createSlice({
  name: 'expedition',
  initialState,
  reducers: {
    setActiveZone: (state, action) => {
      state.activeZone = action.payload.zoneName;
      state.activeZoneObject = state.zones.find(zone => zone.name === action.payload.zoneName);
      state.statistics.currentExpeditionElapsedSeconds = 0;
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
      state.statistics.currentExpeditionElapsedSeconds = 0;
      state.statistics.expeditionStartTime = null;
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
        expeditionIntervalId: null,
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
      console.log('startTime', startTime);
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
    setExpeditionIntervalId: (state, action) => {
      console.log('setting expedition interval id', action.payload, action);
      state.statistics.expeditionIntervalId = action.payload;
    },
    clearExpeditionIntervalId: (state) => {
      if (state.statistics.expeditionIntervalId) {
        clearInterval(state.statistics.expeditionIntervalId);
        state.statistics.expeditionIntervalId = null;
      }
    },
    incrementcurrentExpeditionElapsedSeconds: (state) => {
      state.statistics.currentExpeditionElapsedSeconds += 1;
      console.log('Function Incrementing expedition elapsed seconds', state.statistics.currentExpeditionElapsedSeconds);
    },
    setExpeditionStartTime: (state, action) => {
      state.statistics.expeditionStartTime = action.payload;
      console.log('Expedition start time updated:', state.statistics.expeditionStartTime);
    },
  },
});

export const {
  setActiveZone,
  clearActiveZone,
  setExpeditionIntervalId,
  clearExpeditionIntervalId,
  calculatetotalExpeditionDuration,
  setExpeditionDuration,
  incrementcurrentExpeditionElapsedSeconds,
  resetStatistics,
  updateStatistics,
  setExpeditionStartTime
} = expeditionSlice.actions;

export const handleExpedition = () => (dispatch, getState) => {
  console.log('Handling expedition');
  const state = getState();
  const { activeZone } = state.expedition;
  if (!activeZone) return;
  dispatch(setExpeditionStartTime(Date.now()));
  const interval = setInterval(() => {
    const state = getState();
    const selectedZone = state.expedition.zones.find(zone => zone.name === activeZone);
    const expeditionDuration = selectedZone.duration;
  

    const progress = (state.expedition.statistics.currentExpeditionElapsedSeconds / expeditionDuration) * 100;
    console.log(`Debug seconds: ${state.expedition.statistics.currentExpeditionElapsedSeconds}, Total duration: ${expeditionDuration}, Progress: ${progress}%`);
    
    if (state.expedition.statistics.currentExpeditionElapsedSeconds >= expeditionDuration) {
      console.log('Expedition completed for zone:', activeZone);

      // Handle expedition completion
      const xp = Math.floor(Math.random() * (selectedZone.xpRange[1] - selectedZone.xpRange[0] + 1)) + selectedZone.xpRange[0];
      dispatch(addXp(xp));
      console.log('XP earned:', xp);

      let currencyEarned = 0;
      let lootedItem = null;

      // Handle always/100% drops
      const alwaysDrops = selectedZone.lootDrops.filter(drop => drop.dropRate === 'always' || drop.dropRate === '100%');
      alwaysDrops.forEach(drop => {
        if (drop.type === 'item') {
          dispatch(addItemToInventory({ item: drop.item }));
          console.log('Always item looted:', drop.item.name);
        } else if (drop.type === 'currency') {
          currencyEarned += randomNumberInRange(drop.amountRange[0], drop.amountRange[1]);
          dispatch(addCurrency(currencyEarned));
          console.log('Always currency looted:', currencyEarned);
        }
      });

      // Filter out always/100% drops for random selection
      const randomDrops = selectedZone.lootDrops.filter(drop => drop.dropRate !== 'always' && drop.dropRate !== '100%');

      // Log the drop rates
      randomDrops.forEach(drop => {
        const [numerator, denominator] = drop.dropRate.split(':').map(Number);
        const dropChance = (numerator / denominator) * 100;
        console.log(`Drop chance for ${drop.item?.name || 'currency'}: ${dropChance.toFixed(4)}%`);
      });

      // Determine if an item should be dropped based on its drop rate
      randomDrops.forEach(drop => {
        const [numerator, denominator] = drop.dropRate.split(':').map(Number);
        const dropChance = numerator / denominator;
        const randomValue = Math.random();
        console.log(`Checking drop for ${drop.item?.name || 'currency'}: random value = ${randomValue.toFixed(4)}, drop chance = ${dropChance.toFixed(4)}`);
        if (randomValue <= dropChance) {
          if (drop.type === 'item') {
            dispatch(addItemToInventory({ item: drop.item }));
            lootedItem = drop.item;
            console.log('Item looted:', drop.item.name);
          } else if (drop.type === 'currency') {
            const earned = randomNumberInRange(drop.amountRange[0], drop.amountRange[1]);
            currencyEarned += earned;
            dispatch(addCurrency(earned));
            console.log('Currency looted:', earned);
          }
        }
      });

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
        lootedItems: lootedItem ? [...updatedStateAfterCompletion.statistics.lootedItems, lootedItem] : updatedStateAfterCompletion.statistics.lootedItems,
        totalExpeditionDuration: updatedStateAfterCompletion.statistics.totalExpeditionDuration,
      };
      console.log('Updating statistics with:', statistics); // do i need this and the below?
      dispatch(updateStatistics(statistics));
      console.log('Expedition completed.');
      dispatch(setActiveZone({ zoneName: activeZone }));
      // End Expedition completion logic
    } else {
      console.log('Call to function expedition elapsed seconds if its not time to restart', state.expedition.statistics.currentExpeditionElapsedSeconds);
      // Calculate expedition duration
      dispatch(calculatetotalExpeditionDuration(state));
      dispatch(incrementcurrentExpeditionElapsedSeconds());
    }
  }, 1000);
  dispatch(setExpeditionIntervalId(interval));
};

//export const selectcurrentExpeditionElapsedSeconds = (state) => state.expedition.statistics.currentExpeditionElapsedSeconds;

export default expeditionSlice.reducer;
