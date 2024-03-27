import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Import the HTML5 backend
import InventorySelection from './InventorySelection';
import InventoryGrid from './InventoryGrid';
import React, { useState } from 'react';


function App() {
  // Initial mock global state
  const [inventoryItems, setInventoryItems] = useState({
    availableItems: [
      { id: 'paper', name: 'Paper', shape: 'rectangle', width: 2, height: 1, inGrid: false },
      { id: 'pencil', name: 'Pencil', shape: 'rectangle', width: 1, height: 2, inGrid: false },
      { id: 'eraser', name: 'Eraser', shape: 'square', width: 1, height: 1, inGrid: false },
    ],
    gridItems: Array(16).fill(null), // Assuming a 4x4 grid
  });
  
  
// Function to update the grid items after a successful drop
const updateGridItems = (newGridItems) => {
  setInventoryItems(prevState => ({
    ...prevState,
    gridItems: newGridItems
  }));
};

// Handler for successful drop to update inventory
const onItemDropped = (droppedItem) => {
  setInventoryItems(prevState => {
    // Remove the item from available items
    const availableItems = prevState.availableItems.filter(item => item.id !== droppedItem.id);

    // Optionally, if you want to keep track of items in the grid, you could add them to a new list
    // const newGridItems = [...prevState.gridItems, ...[logic to place item correctly in the grid]];

    return {
      ...prevState,
      availableItems,
      // gridItems: newGridItems, // if keeping track of placed items
    };
  });
};

return (
  <DndProvider backend={HTML5Backend}>
    <main>
      {/* ... */}
      <InventorySelection 
        items={inventoryItems.availableItems} 
        onItemDropped={onItemDropped}
      />
      <InventoryGrid
        gridItems={inventoryItems.gridItems}
        setGridItems={updateGridItems}
        gridSize={4}
      />
      {/* ... */}
    </main>
  </DndProvider>
);
}

export default App;
