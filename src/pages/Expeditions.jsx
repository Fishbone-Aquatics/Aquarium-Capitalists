import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/player/playerSlice'; // Adjust path as necessary
import { Zone, BubblesContainer } from '../components/BubblesContainer'; // Adjust path as necessary
import './expeditions.css'; // Ensure this is the correct path

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.player.activeZone);

  const zones = [
    {
      name: 'Coral Reefs',
      description: 'Rich in colorful fish and rare coral species.'
    },
    {
      name: 'Shipwrecks',
      description: 'Chance to find hidden treasures and ancient artifacts.'
    },
    {
      name: 'Deep Sea Trenches',
      description: 'Home to exotic and rare deep-sea creatures.'
    },
    {
      name: 'Underwater Caves',
      description: 'Potential for discovering unique plant species and minerals.'
    }
  ];

  const handleStart = (zoneName) => {
    dispatch(setActiveZone(zoneName));
  };

  const handleStop = () => {
    dispatch(clearActiveZone());
  };

  return (
    <div>
      <h1>Expeditions</h1>
      <div className="zones">
        {zones.map((zone, index) => (
          <Zone key={index} className={activeZone === zone.name ? 'active' : ''}>
            <h2>{zone.name}</h2>
            <p>{zone.description}</p>
            {activeZone === zone.name ? (
              <>
                <button onClick={handleStop}>Stop</button>
                <BubblesContainer isActive={true} />
              </>
            ) : (
              <button onClick={() => handleStart(zone.name)}>Start</button>
            )}
          </Zone>
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
