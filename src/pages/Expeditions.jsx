import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone, updateStatistics, calculateExpeditionDuration } from '../features/expeditions/expeditionSlice';
import { addXp, addItemToInventory, addCurrency } from '../features/player/playerSlice';
import { randomNumberInRange } from '../utils/randomNumberInRange';
import '../styles/expeditions.css';

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const intervalIdRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const statisticsRef = useRef({
    expeditionsCompleted: 0,
    totalCurrency: 0,
    currencyPerHour: 0,
    totalXp: 0,
    xpPerHour: 0,
    lootedItems: [],
    totalDuration: 0 // To accumulate total duration
  });
  const startTimeRef = useRef(0);

  useEffect(() => {
    const startInterval = () => {
      if (activeZone) {
        const zone = zones.find(zone => zone.name === activeZone);
        console.log(`Starting expedition in zone: ${activeZone}`);
        let elapsedSeconds = 0;
        const totalDuration = zone.duration;
        startTimeRef.current = Date.now();

        intervalIdRef.current = setInterval(() => {
          elapsedSeconds += 1;
          const progress = (elapsedSeconds / totalDuration) * 100;

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${elapsedSeconds} / ${totalDuration} seconds`;
          }

          if (elapsedSeconds >= totalDuration) {
            clearInterval(intervalIdRef.current);

            setTimeout(() => {
              const endTime = Date.now();
              const durationSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
              statisticsRef.current.totalDuration += durationSeconds;

              // Reset progress bar
              if (progressBarRef.current) {
                progressBarRef.current.style.width = '0%';
              }
              if (progressTextRef.current) {
                progressTextRef.current.textContent = `0 / ${totalDuration} seconds`;
              }

              console.log('Granting rewards...');

              // Calculate XP
              const xp = Math.floor(Math.random() * (zone.xpRange[1] - zone.xpRange[0] + 1)) + zone.xpRange[0];
              dispatch(addXp(xp));
              statisticsRef.current.totalXp += xp;

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
                  
                  // Create a copy of lootedItems to avoid direct mutation
                  const lootedItemsCopy = [...statisticsRef.current.lootedItems];
                  const existingItemIndex = lootedItemsCopy.findIndex(item => item.name === selectedDrop.item.name);
                  
                  if (existingItemIndex !== -1) {
                    // Create a new object for the updated item
                    lootedItemsCopy[existingItemIndex] = {
                      ...lootedItemsCopy[existingItemIndex],
                      quantity: lootedItemsCopy[existingItemIndex].quantity + 1
                    };
                  } else {
                    lootedItemsCopy.push({ name: selectedDrop.item.name, quantity: 1 });
                  }
                  
                  // Update the reference
                  statisticsRef.current.lootedItems = lootedItemsCopy;
                } else if (selectedDrop.type === 'currency') {
                  const amount = randomNumberInRange(selectedDrop.amountRange[0], selectedDrop.amountRange[1]);
                  dispatch(addCurrency(amount));
                  console.log(`Added currency: ${amount}`);
                  statisticsRef.current.totalCurrency += amount;
                }
              }

              statisticsRef.current.expeditionsCompleted += 1;

              // Calculate per-hour rates
              const durationHours = statisticsRef.current.totalDuration / 3600;
              statisticsRef.current.xpPerHour = Math.floor(statisticsRef.current.totalXp / durationHours).toLocaleString();
              statisticsRef.current.currencyPerHour = Math.floor(statisticsRef.current.totalCurrency / durationHours).toLocaleString();

              dispatch(updateStatistics({ ...statisticsRef.current }));
              dispatch(calculateExpeditionDuration());

              // Restart the interval
              startInterval();
            }, 1000); // Delay of 1 second before resetting
          }
        }, 1000); // Using 1 second interval for simplicity
      }
    };

    startInterval();

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        // Reset progress bar
        if (progressBarRef.current) {
          progressBarRef.current.style.width = '0%';
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = '';
        }
        console.log('Interval cleared in cleanup');
      }
    };
  }, [activeZone, zones, dispatch]);

  const handleStart = (zoneName) => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current); // Clear any existing interval
      intervalIdRef.current = null;
      // Reset progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = '0%';
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = '';
      }
      console.log('Cleared existing interval before starting a new one');
    }
    dispatch(setActiveZone({ zoneName }));
    console.log(`Expedition started in zone: ${zoneName}`);
  };

  const handleStop = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      // Reset progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = '0%';
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = '';
      }
      console.log('Interval cleared in handleStop');
    }
    dispatch(clearActiveZone());
    dispatch(calculateExpeditionDuration());
    console.log('Expedition stopped.');

    // Reset per-hour calculations
    statisticsRef.current.currencyPerHour = 0;
    statisticsRef.current.xpPerHour = 0;
    dispatch(updateStatistics({ ...statisticsRef.current }));
  };

  return (
    <div>
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
            {activeZone === zone.name && (
              <div className="progress-container">
                <div className="progress-bar" ref={progressBarRef}></div>
                <p className="progress-text" ref={progressTextRef}></p>
              </div>
            )}
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
