// src/features/gathering/gatheringSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeResource: null,
  gatheringStartTime: null,
};

const gatheringSlice = createSlice({
  name: 'gathering',
  initialState,
  reducers: {
    startGatheringResource: (state, action) => {
      state.activeResource = action.payload.resourceName;
      state.gatheringStartTime = Date.now();
    },
    stopGatheringResource: (state) => {
      state.activeResource = null;
      state.gatheringStartTime = null;
    },
  },
});

export const { startGatheringResource, stopGatheringResource } = gatheringSlice.actions;

export default gatheringSlice.reducer;
