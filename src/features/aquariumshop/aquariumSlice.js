// src/features/aquariumshop/aquariumSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maxShopSize: 5,
  items: [
    { id: 1, name: '5 Gallon Tank', icon: '/icons/playersStore/5-gallon-tank.png' },
    { id: 2, name: '10 Gallon Tank', icon: '/icons/playersStore/10-gallon-tank.png' },
    { id: 3, name: '20 Gallon Tank', icon: '/icons/playersStore/20-gallon-tank.png' },
  ],
  gridItems: Array(25).fill(null), // Initialize grid items
};

const aquariumSlice = createSlice({
  name: 'aquarium',
  initialState,
  reducers: {
    increaseShopSize(state) {
      if (state.maxShopSize < 10) {
        state.maxShopSize += 1;
        state.gridItems = Array(state.maxShopSize * state.maxShopSize).fill(null);
      }
    },
    resetShopSize(state) {
      state.maxShopSize = 5;
      state.gridItems = Array(25).fill(null);
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    addItemToGrid(state, action) {
      const { item, index } = action.payload;
      state.gridItems[index] = item;
    },
  },
});

export const { increaseShopSize, resetShopSize, setItems, addItemToGrid } = aquariumSlice.actions;

export default aquariumSlice.reducer;
