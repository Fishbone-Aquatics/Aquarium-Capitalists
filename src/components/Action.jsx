import React from 'react';
import { useSelector } from 'react-redux';

const Action = () => {
  const status = useSelector(state => state.player.status); // Retrieve status from Redux store

  return (
    <div className="action">
      <h2>Action</h2>
      <p>Current Status: {status}</p>
    </div>
  );
};

export default Action;
