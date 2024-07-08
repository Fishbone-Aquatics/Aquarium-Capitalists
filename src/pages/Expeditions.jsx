import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditionSlice'; // Import actions from expeditionSlice
import { addXp } from '../features/player/playerSlice'; // Import the action to add XP
import './expeditions.css'; // Ensure this is the correct path

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone); // Access activeZone from expeditionSlice
  const zones = useSelector((state) => state.expedition.zones); // Access zones from expeditionSlice
  const [progress, setProgress] = useState(0); // Local state for progress
  const [intervalId, setIntervalId] = useState(null); // Local state for interval ID

  useEffect(() => {
    if (activeZone && !intervalId) {
      const zone = zones.find(zone => zone.name === activeZone);
      const id = setInterval(() => {
        setProgress(prevProgress => prevProgress + 1);
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [activeZone, zones, intervalId]);

  useEffect(() => {
    if (activeZone) {
      const zone = zones.find(zone => zone.name === activeZone);
      if (progress >= zone.duration) {
        dispatch(addXp(Math.floor(Math.random() * 5) + 1)); // Random XP between 1 and 5
        setProgress(0); // Reset progress to 0 after completing duration
      }
    }
  }, [progress, activeZone, zones, dispatch]);

  const handleStart = (zoneName) => {
    dispatch(setActiveZone({ zoneName }));
    setProgress(0); // Reset progress when starting a new zone
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    dispatch(clearActiveZone());
    setProgress(0); // Reset progress when stopping
  };

  return (
    <div>
      <h1>Expeditions</h1>
      <div className="zones">
        {zones.map((zone, index) => (
          <div key={index} className={`zone ${activeZone === zone.name ? 'active' : ''}`}>
            <h2>{zone.name}</h2>
            <p>{zone.description}</p>
            {activeZone === zone.name ? (
              <>
                <button onClick={handleStop}>Stop</button>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${(progress / zone.duration) * 100}%` }}></div>
                  <span>{progress}s / {zone.duration}s</span>
                </div>
              </>
            ) : (
              <button onClick={() => handleStart(zone.name)}>Start</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
