import React from 'react';
import { useSelector } from 'react-redux';

const CurrentStatus = () => {
  const status = useSelector((state) => state.player.status);
  const currency = useSelector((state) => state.player.stats.currency);

  return (
    <div>
      Current Status: {status}, Currency: {currency}
    </div>
  );
};

export default CurrentStatus;
