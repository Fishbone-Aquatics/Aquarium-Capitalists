import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BubblesContainer } from './BubblesContainer';

// Styled components for Zone
const ZoneContainer = styled.div`
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
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Heading = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  padding: 5px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
`;

const InfoIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5em;
`;

const Tooltip = styled.div`
  visibility: hidden;
  width: 150px;
  background-color: #2c3e50;
  color: #fff;
  text-align: left;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 10px; /* Move down a bit */
  right: 60px; /* Move left a bit */
  opacity: 60;
  transition: opacity 0.3s, font-size 0.3s;
  font-size: 0.6em; /* Make the text smaller */

  ${InfoIcon}:hover & {
    visibility: visible;
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #2c3e50 transparent transparent transparent;
  }
`;

const Zone = ({ zone, activeZone, handleStart, handleStop, progressBarRef, progressTextRef }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (activeZone === zone.name) {
      console.log('Active Zone:', activeZone);
      console.log('Progress bar ref:', progressBarRef.current);
      console.log('Progress text ref:', progressTextRef.current);
    }
  }, [activeZone, zone.name, progressBarRef, progressTextRef]);

  return (
    <ZoneContainer
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      style={{ backgroundImage: `url(${zone.image})` }}
    >
      <HeaderContainer>
        <Heading>{zone.name}</Heading>
        <div className="button-container">
          {activeZone === zone.name ? (
            <button className="stop-button" onClick={handleStop}>Stop</button>
          ) : (
            <button className="start-button" onClick={() => handleStart(zone.name)}>Start</button>
          )}
        </div>
      </HeaderContainer>
      {activeZone === zone.name && (
        <div className="progress-container">
          <div ref={progressBarRef} className="progress-bar"></div>
          <p ref={progressTextRef} className="progress-text"></p>
        </div>
      )}
      <div className="description-container">
        <p>{zone.description}</p>
      </div>
      <BubblesContainer isActive={isActive} />
      <InfoIcon>
        &#33;
        <Tooltip>
          <h4>Drops and Rates:</h4>
          <ul>
            {zone.lootDrops.map((drop, index) => {
              const [numerator, denominator] = drop.dropRate.split(':').map(Number);
              const dropChance = numerator && denominator ? (numerator / denominator) * 100 : null;
              return (
                <li key={index}>
                  {drop.item ? drop.item.name : 'Currency'}: {drop.dropRate} {dropChance !== null ? `(${dropChance.toFixed(4)}%)` : '(100%)'}
                </li>
              );
            })}
          </ul>
        </Tooltip>
      </InfoIcon>
    </ZoneContainer>
  );
};

export default Zone;
