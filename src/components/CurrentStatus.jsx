import React from 'react';
import { useSelector } from 'react-redux';

const CurrentStatus = () => {
  const status = useSelector((state) => state.player.status);
  const currency = useSelector((state) => state.player.stats.currency);
  const level = useSelector((state) => state.player.stats.level);
  const xp = useSelector((state) => state.player.stats.xp);

  return (
    <div>
      Current Status: {status}, Currency: {currency}, Level: {level}, XP: {xp}
    </div>
  );
};

export default CurrentStatus;
