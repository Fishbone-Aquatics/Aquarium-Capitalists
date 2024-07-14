import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditions/expeditionSlice';
import { addXp, addItemToInventory, addCurrency } from '../features/player/playerSlice';
import { randomNumberInRange } from '../utils/randomNumberInRange'; // Import the utility function
import '../styles/expeditions.css'; // Import the CSS file

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      console.log('Cleared existing interval in useEffect');
    }

    if (activeZone) {
      const zone = zones.find(zone => zone.name === activeZone);
      console.log(`Starting expedition in zone: ${activeZone}`);

      intervalIdRef.current = setInterval(() => {
        console.log('Granting rewards...');
        
        // Calculate XP
        const xp = Math.floor(Math.random() * (zone.xpRange[1] - zone.xpRange[0] + 1)) + zone.xpRange[0];
        dispatch(addXp(xp));

        // Calculate loot drops
        const totalChance = zone.lootDrops.reduce((total, drop) => total + drop.chance, 0);
        const randomChance = Math.random() * totalChance;

        let cumulativeChance = 0;
        const selectedDrop = zone.lootDrops.find(drop => {
          cumulativeChance += drop.chance;
          return randomChance <= cumulativeChance;
        });

        if (selectedDrop) {
          if (selectedDrop.type === 'item') {
            dispatch(addItemToInventory({ item: selectedDrop.item }));
            console.log(`Added item: ${selectedDrop.item.name} to inventory`);
          } else if (selectedDrop.type === 'currency') {
            const amount = randomNumberInRange(selectedDrop.amountRange[0], selectedDrop.amountRange[1]);
            dispatch(addCurrency(amount));
            console.log(`Added currency: ${amount}`);
          }
        }
      }, zone.duration * 1000); // Using duration in seconds for simplicity
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        console.log('Interval cleared in cleanup');
      }
    };
  }, [activeZone, zones, dispatch]);

  const handleStart = (zoneName) => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current); // Clear any existing interval
      intervalIdRef.current = null;
      console.log('Cleared existing interval before starting a new one');
    }
    dispatch(setActiveZone({ zoneName }));
    console.log(`Expedition started in zone: ${zoneName}`);
  };

  const handleStop = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      console.log('Interval cleared in handleStop');
    }
    dispatch(clearActiveZone());
    console.log('Expedition stopped.');
  };

  return (
    <div>
      <h1>Expeditions</h1>
      <div className="zones">
        {zones.map((zone, index) => (
          <div
            key={index}
            className={`zone ${activeZone === zone.name ? 'active' : ''}`}
            style={{ backgroundImage: `url(${zone.image})` }}
          >
            <div className="header-container">
              <h2 className="heading" title={zone.name}>{zone.name}</h2>
              <div className="button-container">
                {activeZone === zone.name ? (
                  <button className="stop-button" onClick={handleStop}>Stop</button>
                ) : (
                  <button className="start-button" onClick={() => handleStart(zone.name)}>Start</button>
                )}
              </div>
            </div>
            <div className="description-container">
              <p>{zone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
