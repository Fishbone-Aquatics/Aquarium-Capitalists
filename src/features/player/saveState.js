// src/features/player/saveState.js
export const saveState = (state) => {
    localStorage.setItem('playerState', JSON.stringify(state));
  };
  