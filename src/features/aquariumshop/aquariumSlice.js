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
    addNewItemToGrid(state, action) {
      const { item, index } = action.payload;
      const { rows, cols } = item.size;
      const gridSize = Math.sqrt(state.gridItems.length);

      // Check for overlap
      let canPlace = true;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const targetIndex = index + r * gridSize + c;
          if (targetIndex >= state.gridItems.length || state.gridItems[targetIndex] !== null) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }

      // Place item if no overlap
      if (canPlace) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetIndex = index + r * gridSize + c;
            if (targetIndex >= 0 && targetIndex < state.gridItems.length) {
              state.gridItems[targetIndex] = { ...item, id: `${item.id}-${Date.now()}` }; // Ensure unique ID for each new item
            }
          }
        }
      }
    },
    moveItemWithinGrid(state, action) {
      const { item, index } = action.payload;
      const { rows, cols } = item.size;
      const gridSize = Math.sqrt(state.gridItems.length);

      // Remove the item from its previous position
      const previousIndex = state.gridItems.findIndex(gridItem => gridItem && gridItem.id === item.id);
      if (previousIndex !== -1) {
        const previousRow = Math.floor(previousIndex / gridSize);
        const previousCol = previousIndex % gridSize;
        for (let r = 0; r < item.size.rows; r++) {
          for (let c = 0; c < item.size.cols; c++) {
            const targetIndex = (previousRow + r) * gridSize + (previousCol + c);
            state.gridItems[targetIndex] = null;
          }
        }
      }

      // Check if the item can be placed without overlapping
      let canPlace = true;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const targetIndex = index + r * gridSize + c;
          if (targetIndex >= state.gridItems.length || state.gridItems[targetIndex] !== null) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }

      // Place the item if there's no overlap, otherwise swap
      if (canPlace) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetIndex = index + r * gridSize + c;
            if (targetIndex >= 0 && targetIndex < state.gridItems.length) {
              state.gridItems[targetIndex] = item;
            }
          }
        }
      } else {
        // Handle swapping logic if the space is occupied
        const occupiedItem = state.gridItems[index];
        const occupiedSize = occupiedItem.size;

        // Clear the space of the occupied item
        for (let r = 0; r < occupiedSize.rows; r++) {
          for (let c = 0; c < occupiedSize.cols; c++) {
            const targetIndex = index + r * gridSize + c;
            state.gridItems[targetIndex] = null;
          }
        }

        // Place the moving item
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetIndex = index + r * gridSize + c;
            if (targetIndex >= 0 && targetIndex < state.gridItems.length) {
              state.gridItems[targetIndex] = item;
            }
          }
        }

        // Find the first empty spot to place the swapped item
        const emptyIndex = state.gridItems.findIndex((gridItem) => gridItem === null);
        if (emptyIndex !== -1) {
          const emptyRow = Math.floor(emptyIndex / gridSize);
          const emptyCol = emptyIndex % gridSize;
          let canPlace = true;
          for (let r = 0; r < occupiedSize.rows; r++) {
            for (let c = 0; c < occupiedSize.cols; c++) {
              const targetIndex = emptyIndex + r * gridSize + c;
              if (targetIndex >= state.gridItems.length || state.gridItems[targetIndex] !== null) {
                canPlace = false;
                break;
              }
            }
            if (!canPlace) break;
          }
          if (canPlace) {
            for (let r = 0; r < occupiedSize.rows; r++) {
              for (let c = 0; c < occupiedSize.cols; c++) {
                const targetIndex = emptyIndex + r * gridSize + c;
                if (targetIndex >= 0 && targetIndex < state.gridItems.length) {
                  state.gridItems[targetIndex] = occupiedItem;
                }
              }
            }
          }
        }
      }
    },
    setDropIndicator(state, action) {
      state.dropIndicator = action.payload;
    },
  },
});

export const { increaseShopSize, resetShopSize, setItems, addNewItemToGrid, moveItemWithinGrid, setDropIndicator } = aquariumSlice.actions;

export default aquariumSlice.reducer;
