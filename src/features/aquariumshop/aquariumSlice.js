import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maxShopSize: 5,
  items: [
    { id: 1, name: '5 Gallon Tank', icon: '/icons/playersStore/5-gallon-tank.png', size: { rows: 1, cols: 1 } },
    { id: 2, name: '10 Gallon Tank', icon: '/icons/playersStore/10-gallon-tank.png', size: { rows: 2, cols: 2 } },
    { id: 3, name: '20 Gallon Tank', icon: '/icons/playersStore/20-gallon-tank.png', size: { rows: 2, cols: 3 } },
  ],
  gridItems: Array(25).fill(null), // Initialize grid items
  dropIndicator: null, // Initialize drop indicator as null
};

const aquariumSlice = createSlice({
  name: 'aquarium',
  initialState,
  reducers: {
    increaseShopSize(state) {
      if (state.maxShopSize < 10) {
        state.maxShopSize += 1;
        const newGridSize = state.maxShopSize * state.maxShopSize;
        const newGridItems = Array(newGridSize).fill(null);

        // Copy existing items to the new grid
        const gridSize = Math.sqrt(state.gridItems.length);
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            const newIndex = row * state.maxShopSize + col;
            if (state.gridItems[index]) {
              newGridItems[newIndex] = state.gridItems[index];
            }
          }
        }

        state.gridItems = newGridItems;
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
      const { rows, cols } = item.size;
      const gridSize = Math.sqrt(state.gridItems.length);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const targetIndex = index + r * gridSize + c;
          if (targetIndex >= 0 && targetIndex < state.gridItems.length) {
            state.gridItems[targetIndex] = item;
          }
        }
      }
    },
    setDropIndicator(state, action) {
      state.dropIndicator = action.payload;
    },
  },
});

export const { increaseShopSize, resetShopSize, setItems, addItemToGrid, setDropIndicator } = aquariumSlice.actions;

export default aquariumSlice.reducer;
