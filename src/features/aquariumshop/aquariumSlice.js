// src/features/aquariumshop/aquariumSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maxShopSize: 5,
};

const aquariumSlice = createSlice({
  name: 'aquarium',
  initialState,
  reducers: {
    increaseShopSize(state) {
      if (state.maxShopSize < 10) {
        state.maxShopSize += 1;
      }
    },
    resetShopSize(state) {
      state.maxShopSize = 5;
    },
  },
});

export const { increaseShopSize, resetShopSize } = aquariumSlice.actions;

export default aquariumSlice.reducer;
