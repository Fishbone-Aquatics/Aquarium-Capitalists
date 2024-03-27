// src/pages/expeditions/Expeditions.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Expeditions from './Expeditions';
import { setActiveZone, clearActiveZone } from '../features/expeditions/expeditionSlice';

const mockStore = configureMockStore();
const initialState = {
  player: {
    name: 'Player',
    status: 'idle',
    inventory: [],
    equipment: {},
    stats: { level: 1, xp: 0, currency: 0 },
  },
  expedition: {
    activeZone: null,
    zones: [
      {
        name: 'Forest',
        description: 'A dense forest.',
        duration: 10,
        xpRange: [10, 20],
        itemDrops: [],
        currencyDrops: [],
      },
    ],
  },
};

describe('Expeditions Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('Player status changes from idle when starting an expedition', async () => {
    render(
      <Provider store={store}>
        <Expeditions />
      </Provider>
    );

    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(setActiveZone({ zoneName: 'Forest' }));

    const state = store.getState();
    expect(state.expedition.activeZone).toBe('Forest');
  });

  test('Player status returns to idle when stopping an expedition', async () => {
    store = mockStore({
      ...initialState,
      expedition: {
        ...initialState.expedition,
        activeZone: 'Forest',
      },
    });

    render(
      <Provider store={store}>
        <Expeditions />
      </Provider>
    );

    const stopButton = screen.getByText('Stop');
    fireEvent.click(stopButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(clearActiveZone());

    const state = store.getState();
    expect(state.expedition.activeZone).toBeNull();
  });
});
