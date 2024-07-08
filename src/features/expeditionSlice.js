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
          description: 'Rich in colorful fish and rare coral species.'
        },
        {
          name: 'Shipwrecks',
          description: 'Chance to find hidden treasures and ancient artifacts.'
        },
        {
          name: 'Deep Sea Trenches',
          description: 'Home to exotic and rare deep-sea creatures.'
        },
        {
          name: 'Underwater Caves 3',
          description: 'Potential for discovering unique plant species and minerals.'
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
      state.activeZone = action.payload;
    },
    clearActiveZone: (state) => {
      state.activeZone = null;
    },
  },
});

export const { setActiveZone, clearActiveZone } = expeditionSlice.actions;

export default expeditionSlice.reducer;
