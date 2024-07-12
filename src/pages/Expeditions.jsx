import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditions/expeditionSlice';
import { addXp, addItemToInventory, addCurrency } from '../features/player/playerSlice';
import styled, { keyframes } from 'styled-components';
import { randomNumberInRange } from '../utils/randomNumberInRange'; // Import the utility function

// Keyframes for bubble animation
const rise = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-350px);
    opacity: 0;
  }
`;

// Styled components
const Zones = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  background-color: #121212; /* Dark background color */
  padding: 20px;
  border-radius: 10px;
`;

const Zone = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
  border: none;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-size 0.3s ease;
  cursor: pointer;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space between h2 and button */
  position: absolute;
  bottom: 140px; /* Adjusted to move it down */
  left: 20px;
  right: 20px; /* Add padding to the right */
  padding: 5px 10px;
  border-radius: 5px;
  box-sizing: border-box; /* Include padding in width calculation */
`;

const Heading = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  padding: 5px 10px;
  white-space: nowrap; /* Ensure the text does not wrap */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  max-width: 70%; /* Adjust max width for shorter headers */
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 5px; /* Rounded corners */
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the progress bar */
  position: absolute;
  bottom: 0; /* Adjusted to move it up */
  left: 0;
  width: 100%; /* Ensure it spans the full width */
  padding: 10px 20px; /* Ensure there is at least 10px of padding */
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 0 0 5px 5px; /* Rounded bottom corners */
  box-sizing: border-box; /* Include padding in width calculation */
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px; /* Increase the height */
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  padding: 0; /* Remove padding */
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #4caf50;
  transition: width 1s linear;
`;

const ProgressText = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-weight: bold;
`;

const StartButton = styled.button`
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 1.5em; /* Increase font size to match h2 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); /* Match shadow */
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); /* Match shadow */

  &:hover {
    background-color: #32cd32; /* Lime green on hover */
  }
`;

const StopButton = styled(StartButton)`
  background-color: #ff0000; /* Red background for Stop button */
  &:hover {
    background-color: #ff6347; /* Tomato red on hover */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Bubble = styled.div`
  position: absolute;
  bottom: -50px;
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  border-radius: 50%;
  opacity: 0.7;
  animation: ${rise} 5s infinite ease-in-out;
  left: ${props => props.left || '50%'};
  animation-duration: ${props => props.duration || '5s'};
  animation-delay: ${props => props.delay || '0s'};
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  border: ${props => props.border};
`;

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
        setProgress(prevProgress => prevProgress + 1);
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
  }, [activeZone, intervalId]);

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

  useEffect(() => {
    if (activeZone) {
      const zone = zones.find(zone => zone.name === activeZone);
      if (progress >= zone.duration) {
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

        // Reset progress
        setProgress(0);
      }
    }
  }, [progress, activeZone, zones, dispatch]);

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
      <Zones>
        {zones.map((zone, index) => (
          <Zone
            key={index}
            className={activeZone === zone.name ? 'active' : ''}
            style={{ backgroundImage: `url(${zone.image})` }}
            onMouseEnter={() => setHoveredZone(zone.name)}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {hoveredZone === zone.name && bubbles.map(bubble => (
              <Bubble
                key={bubble.id}
                left={bubble.left}
                duration={bubble.duration}
                delay={bubble.delay}
                size={bubble.size}
                color={bubble.color}
                border={bubble.border}
              />
            ))}
            <HeaderContainer>
              <Heading>{zone.name}</Heading>
              <ButtonContainer>
                {activeZone === zone.name ? (
                  <StopButton onClick={handleStop}>Stop</StopButton>
                ) : (
                  <StartButton onClick={() => handleStart(zone.name)}>Start</StartButton>
                )}
              </ButtonContainer>
            </HeaderContainer>
            <DescriptionContainer>
              <p>{zone.description}</p>
              {activeZone === zone.name && (
                <ProgressBarContainer>
                  <ProgressBar style={{ width: `${(progress / zone.duration) * 100}%` }}></ProgressBar>
                  <ProgressText>{progress}s / {zone.duration}s</ProgressText>
                </ProgressBarContainer>
              )}
            </DescriptionContainer>
          </Zone>
        ))}
      </Zones>
    </div>
  );
};

export default Expeditions;
