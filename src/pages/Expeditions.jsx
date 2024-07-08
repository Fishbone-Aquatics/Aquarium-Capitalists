import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditionSlice'; // Import actions from expeditionSlice
import { Zone, BubblesContainer } from '../components/BubblesContainer';
import './expeditions.css'; // Ensure this is the correct path

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone); // Access activeZone from expeditionSlice

  const zones = useSelector((state) => state.expedition.zones); // Access zones from expeditionSlice

  const handleStart = (zoneName) => {
    dispatch(setActiveZone(zoneName));
    // Optionally, dispatch actions or perform tasks related to starting an expedition
  };

  const handleStop = () => {
    dispatch(clearActiveZone());
    // Optionally, dispatch actions or perform tasks related to stopping an expedition
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
