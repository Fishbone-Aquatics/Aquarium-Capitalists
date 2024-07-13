import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditions/expeditionSlice';
import { addXp, addItemToInventory, addCurrency } from '../features/player/playerSlice';
import { randomNumberInRange } from '../utils/randomNumberInRange'; // Import the utility function
import '../styles/expeditions.css'; // Import the CSS file

const getRandomBubbleProperties = () => {
  const colors = ['rgba(255, 255, 255, 0.8)', 'rgba(135, 206, 235, 0.8)'];
  const borders = ['2px solid rgba(255, 255, 255, 0.5)', '2px solid rgba(135, 206, 235, 0.5)'];

  const color = colors[Math.floor(Math.random() * colors.length)];
  const border = borders[Math.floor(Math.random() * borders.length)];

  return { color, border };
};

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [hoveredZone, setHoveredZone] = useState(null);

  useEffect(() => {
    if (activeZone && !intervalId) {
      const id = setInterval(() => {
        setProgress(prevProgress => {
          const zone = zones.find(zone => zone.name === activeZone);
          const newProgress = prevProgress + 1;
          if (newProgress >= zone.duration) {
            // Calculate XP
            const xp = Math.floor(Math.random() * (zone.xpRange[1] - zone.xpRange[0] + 1)) + zone.xpRange[0];
            dispatch(addXp(xp));

            // Calculate loot drops
            const totalChance = zone.lootDrops.reduce((total, drop) => total + drop.chance, 0);
            const randomChance = Math.random() * totalChance;

            let cumulativeChance = 0;
            for (let drop of zone.lootDrops) {
              cumulativeChance += drop.chance;
              if (randomChance <= cumulativeChance) {
                if (drop.type === 'item') {
                  dispatch(addItemToInventory({ item: drop.item }));
                  console.log(`Added item: ${drop.item.name} to inventory`);
                } else if (drop.type === 'currency') {
                  const amount = randomNumberInRange(drop.amountRange[0], drop.amountRange[1]);
                  dispatch(addCurrency(amount));
                  console.log(`Added currency: ${amount}`);
                }
                break;
              }
            }

            // Delay for 1 second before resetting progress
            setTimeout(() => {
              setProgress(0);
            }, 1000);

            return zone.duration; // Ensure it shows 100% for the delay duration
          }
          return newProgress;
        });
      }, 1000);
      setIntervalId(id);
      console.log(`Expedition started in zone: ${activeZone}`);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [activeZone, intervalId, zones, dispatch]);

  useEffect(() => {
    if (hoveredZone) {
      const interval = setInterval(() => {
        const newBubble = {
          id: Date.now(),
          left: `${Math.random() * 100}%`,
          duration: `${4 + Math.random() * 2}s`,
          delay: `${Math.random() * 2}s`,
          size: `${10 + Math.random() * 15}px`,
          ...getRandomBubbleProperties(),
        };
        setBubbles(prevBubbles => [...prevBubbles, newBubble]);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setBubbles([]);
    }
  }, [hoveredZone]);

  const handleStart = (zoneName) => {
    dispatch(setActiveZone({ zoneName }));
    setProgress(0);
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    dispatch(clearActiveZone());
    setProgress(0);
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
            onMouseEnter={() => setHoveredZone(zone.name)}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {hoveredZone === zone.name && bubbles.map(bubble => (
              <div
                key={bubble.id}
                className="bubble"
                style={{
                  left: bubble.left,
                  animationDuration: bubble.duration,
                  animationDelay: bubble.delay,
                  width: bubble.size,
                  height: bubble.size,
                  backgroundColor: bubble.color,
                  border: bubble.border,
                }}
              />
            ))}
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
              {activeZone === zone.name && (
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${(progress / zone.duration) * 100}%` }}></div>
                  <span className="progress-text">{progress}s / {zone.duration}s</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
