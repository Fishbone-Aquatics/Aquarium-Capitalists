// src/features/aquariumshop/aquariumSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maxShopSize: 5,
  items: [
    { id: 1, name: '5 Gallon Tank', icon: '/icons/playersStore/5-gallon-tank.png' },
    { id: 2, name: '10 Gallon Tank', icon: '/icons/playersStore/10-gallon-tank.png' },
    { id: 2, name: '20 Gallon Tank', icon: '/icons/playersStore/20-gallon-tank.png' },
  ],
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
    // You can add more actions to add/remove/update items as needed
  },
});

export const { increaseShopSize, resetShopSize } = aquariumSlice.actions;

export default aquariumSlice.reducer;
