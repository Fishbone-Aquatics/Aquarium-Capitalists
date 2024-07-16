// src/features/gathering/gatheringSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { updateSkillXp, addItemToInventory } from '../player/playerSlice';

const initialState = {
  activeResource: null,
  gatheringStartTime: null,
  notificationMessage: null,
};

const gatheringSlice = createSlice({
  name: 'gathering',
  initialState,
  reducers: {
    startGatheringResource: (state, action) => {
      console.log('now starting gathering');
      state.activeResource = action.payload.resource;
      state.gatheringStartTime = Date.now();
    },
    stopGatheringResource: (state) => {
      console.log('now ending gathering');
      state.activeResource = null;
      state.gatheringStartTime = null;
    },
    setNotificationMessage: (state, action) => {
      state.notificationMessage = action.payload;
    },
    clearNotificationMessage: (state) => {
      state.notificationMessage = null;
    },
  },
});

export const { startGatheringResource, stopGatheringResource, setNotificationMessage, clearNotificationMessage } = gatheringSlice.actions;

export const handleGathering = () => async (dispatch, getState) => {
  console.log('handle gather called');
  const state = getState();
  const { activeResource } = state.gathering;
  if (!activeResource) return;

  const selectedItem = activeResource;
  
  setTimeout(async () => {
    const newState = getState();
    if (newState.gathering.activeResource === activeResource) { // Re-check if gathering is still active and the same resource
      const xpGainedValue = Math.floor(Math.random() * (selectedItem.gatheringDrops.xpRange[1] - selectedItem.gatheringDrops.xpRange[0] + 1)) + selectedItem.gatheringDrops.xpRange[0];
      console.log("Gathering completed, gained xp: ", xpGainedValue);
      await dispatch(updateSkillXp({ skill: 'gathering', xp: xpGainedValue }));
      await dispatch(addItemToInventory({ item: selectedItem }));
      dispatch(setNotificationMessage(`Gathered ${selectedItem.name} and gained ${xpGainedValue} XP!`));
      dispatch(handleGathering()); // Recurse to keep gathering
    }
  }, selectedItem.duration);
};

export default gatheringSlice.reducer;
