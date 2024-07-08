import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  const savedState = localStorage.getItem('expeditionState');
  if (savedState) {
    return JSON.parse(savedState);
  } else {
    return {
      name: "expedition",
      zones: [
        {
          name: 'Coral Reefs',
          description: 'Rich in colorful fish and rare coral species.',
          duration: 10 // seconds
        },
        {
          name: 'Shipwrecks',
          description: 'Chance to find hidden treasures and ancient artifacts.',
          duration: 30 // seconds
        },
        {
          name: 'Deep Sea Trenches',
          description: 'Home to exotic and rare deep-sea creatures.',
          duration: 45 // seconds
        },
        {
          name: 'Underwater Caves',
          description: 'Potential for discovering unique plant species and minerals.',
          duration: 60 // seconds
        }
      ],
      activeZone: null,
    };
  }
};

export const expeditionSlice = createSlice({
  name: 'expedition',
  initialState: loadInitialState(),
  reducers: {
    setActiveZone: (state, action) => {
      state.activeZone = action.payload.zoneName;
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
    },
  },
});

export const { setActiveZone, clearActiveZone } = expeditionSlice.actions;

export default expeditionSlice.reducer;
