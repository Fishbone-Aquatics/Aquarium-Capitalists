// src/pages/inventory/Inventory.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Inventory from './Inventory';
import { swapItems, swapEquipmentAndInventory, unequipItem } from '../features/player/playerSlice';

const mockStore = configureMockStore();
const initialState = {
  player: {
    name: 'Player',
    status: 'idle',
    inventory: [
      { id: '1', name: 'Light', type: 'Light', image: 'light.png' },
      { id: '2', name: 'Filter', type: 'Filter', image: 'filter.png' },
      { id: 'empty-slot', name: 'Empty slot', type: 'Empty', image: '' }
    ],
    equipment: {
      heater: { id: '3', name: 'Heater', type: 'Heater', image: 'heater.png' }
    },
    stats: { level: 1, xp: 0, currency: 0 },
  },
  expedition: {
    activeZone: null,
    zones: []
  },
};

describe('Inventory Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('Player status changes from idle when starting an expedition', () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <Inventory />
        </DndProvider>
      </Provider>
    );

    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(setActiveZone({ zoneName: 'Forest' }));

    const state = store.getState();
    expect(state.expedition.activeZone).toBe('Forest');
  });

  test('Swaps items within inventory', () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <Inventory />
        </DndProvider>
      </Provider>
    );

    const item1 = screen.getByText('Light (Light)');
    const item2 = screen.getByText('Filter (Filter)');

    fireEvent.dragStart(item1);
    fireEvent.drop(item2);

    const actions = store.getActions();
    expect(actions).toContainEqual(swapItems({ from: 0, to: 1 }));

    const state = store.getState();
    expect(state.player.inventory[0]).toEqual(initialState.player.inventory[1]);
    expect(state.player.inventory[1]).toEqual(initialState.player.inventory[0]);
  });

  test('Swaps items between inventory and equipment', () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <Inventory />
        </DndProvider>
      </Provider>
    );

    const item1 = screen.getByText('Light (Light)');
    const equipmentSlot = screen.getByText('Heater (Heater)');

    fireEvent.dragStart(item1);
    fireEvent.drop(equipmentSlot);

    const actions = store.getActions();
    expect(actions).toContainEqual(swapEquipmentAndInventory({ fromInventoryIndex: 0, toEquipmentSlot: 'heater' }));

    const state = store.getState();
    expect(state.player.inventory[0]).toEqual(initialState.player.equipment.heater);
    expect(state.player.equipment.heater).toEqual(initialState.player.inventory[0]);
  });

  test('Unequip item and place it in inventory', () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <Inventory />
        </DndProvider>
      </Provider>
    );

    const equipmentSlot = screen.getByText('Heater (Heater)');
    const emptySlot = screen.getByText('Empty slot');

    fireEvent.dragStart(equipmentSlot);
    fireEvent.drop(emptySlot);

    const actions = store.getActions();
    expect(actions).toContainEqual(unequipItem({ slot: 'heater', targetIndex: 2 }));

    const state = store.getState();
    expect(state.player.equipment.heater).toEqual({ ...items.equipment.emptySlot, type: 'Heater' });
    expect(state.player.inventory[2]).toEqual(initialState.player.equipment.heater);
  });
});
