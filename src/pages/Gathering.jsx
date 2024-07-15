import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/gathering.css';
import items from '../data/items/items';
import { updateSkillXp, addItemToInventory } from '../features/player/playerSlice';
import { getRequiredXPForLevel } from '../features/player/xpCalculator'; // Import the helper function

const Gathering = () => {
  const [activeTab, setActiveTab] = useState('minerals');
  const [activePlaceholderTab, setActivePlaceholderTab] = useState('placeholder1');
  const [isGathering, setIsGathering] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [xpGained, setXpGained] = useState(null);
  const timeoutRef = useRef(null);
  const gatheringCompletedRef = useRef(false);
  const resource = items.resource;
  const dispatch = useDispatch();

  const minerals = Object.values(resource).filter(item => item.type.toLowerCase() === 'mineral');
  const resources = Object.values(resource).filter(item => item.type.toLowerCase() === 'resource');

  const initialSelectedItem = minerals.length > 0 ? minerals[0] : {
    name: 'Silica',
    image: '/icons/resource/silica.png',
    duration: 5000,
    gatheringDrops: {
      items: [{ id: 'silica', name: "Silica", quantity: 1 }],
      xpRange: [5, 10],
    }
  };
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);

  const gatheringSkill = useSelector(state => state.player.skills.gathering);
  const skillBoostPercent = useSelector(state => state.player.skillBoostPercent);
  const gatheringSpeed = useSelector(state => state.player.gatheringSpeed);
  const gatheringEfficiency = useSelector(state => state.player.gatheringEfficiency);

  const currentLevel = gatheringSkill.level;
  const currentXP = gatheringSkill.xp;
  const requiredXPForCurrentLevel = getRequiredXPForLevel(currentLevel);
  const requiredXPForNextLevel = getRequiredXPForLevel(currentLevel + 1);
  const xpPercentage = (currentXP / requiredXPForNextLevel) * 100;

  const handleGather = useCallback(() => {
    console.log('handleGather called');
    if (!gatheringCompletedRef.current) {
      gatheringCompletedRef.current = true;
      console.log('Gathering completed for:', selectedItem);
      const { gatheringDrops } = selectedItem;
      const xpGainedValue = Math.floor(Math.random() * (gatheringDrops.xpRange[1] - gatheringDrops.xpRange[0] + 1)) + gatheringDrops.xpRange[0];
      console.log('XP gained:', xpGainedValue);
      dispatch(updateSkillXp({ skill: 'gathering', xp: xpGainedValue }));
      dispatch(addItemToInventory({ item: selectedItem }));
      setXpGained(xpGainedValue);
      setTimeout(() => {
        gatheringCompletedRef.current = false;
        console.log('gatheringCompletedRef reset');
      }, 0);
    }
  }, [dispatch, selectedItem]);

  const startGathering = useCallback(() => {
    if (isGathering) {
      timeoutRef.current = setTimeout(() => {
        handleGather();
        startGathering();
      }, selectedItem.duration);
    }
  }, [isGathering, selectedItem.duration, handleGather]);

  useEffect(() => {
    if (isGathering) {
      startGathering();
    } else {
      clearTimeout(timeoutRef.current);
    }
  }, [isGathering, startGathering]);

  useEffect(() => {
    if (xpGained !== null) {
      setNotificationMessage(`Gathered ${selectedItem.name} and gained ${xpGained} XP!`);
      setXpGained(null);
    }
  }, [xpGained, selectedItem.name]);

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage(null);
        console.log('Notification message cleared');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    setSelectedItem({
      name: item.name,
      id: item.id,
      type: item.type,
      image: item.image,
      duration: item.duration,
      gatheringDrops: item.gatheringDrops,
    });
    console.log('Selected item set');
  };

  const handleToggleGathering = () => {
    console.log('handleToggleGathering called');
    if (isGathering) {
      handleStop();
    } else {
      setIsGathering(true);
      console.log('Gathering started');
    }
  };

  const handleStop = () => {
    console.log('handleStop called');
    setIsGathering(false);
    clearTimeout(timeoutRef.current);
    console.log('Gathering stopped');
  };

  useEffect(() => {
    console.log('Selected item changed:', selectedItem);
  }, [selectedItem]);

  return (
    <div className="gathering-container">
      <div className="gathering-column">
        <div className="gathering-header">
          <h2>{selectedItem.name}</h2>
          <div className="image-and-button">
            <div className="image-border">
              <img src={selectedItem.image} alt={selectedItem.name} />
            </div>
            <button className={`toggle-btn ${isGathering ? 'stop' : 'gather'} gather-button`} onClick={handleToggleGathering}>
              {isGathering ? 'Stop' : 'Gather'}
            </button>
          </div>
          <div className="gathering-drops">
            <h3>Drops</h3>
            <ul>
              {selectedItem.gatheringDrops.items.map((drop, index) => (
                <li key={index} className="drop-item">
                  <span className="drop-name">{drop.name}</span>
                  <span className="drop-quantity">x{drop.quantity}</span>
                </li>
              ))}
              <li className="drop-item">
                <span className="drop-name">XP</span>
                <span className="drop-type">{selectedItem.gatheringDrops.xpRange[0]}-{selectedItem.gatheringDrops.xpRange[1]}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="gathering-toggle">
          <button
            className={`toggle-button ${activePlaceholderTab === 'placeholder1' ? 'active' : ''}`}
            onClick={() => setActivePlaceholderTab('placeholder1')}
          >
            Place holder 1
          </button>
          <button
            className={`toggle-button ${activePlaceholderTab === 'placeholder2' ? 'active' : ''}`}
            onClick={() => setActivePlaceholderTab('placeholder2')}
          >
            Place holder 2
          </button>
        </div>
        <div className="gathering-consumables">
          <div className="consumables-label">Consumables (placeholder)</div>
          <div className="consumables-square-container">
            <div className="consumables-square"></div>
            <div className="consumables-square"></div>
          </div>
        </div>
      </div>
      <div className="gathering-column">
        <div className="gathering-sidebar">
          <h3>Gathering</h3>
          <p>Level: {gatheringSkill.level}</p>
          <p>XP Progress: {xpPercentage.toFixed(2)}% ({currentXP} / {requiredXPForCurrentLevel} XP)</p>
          <p>Gathering Speed: +{gatheringSpeed * 100}%</p>
          <p>Gathering Efficiency: +{gatheringEfficiency * 100}%</p>
          <p>Total Gathering XP: {gatheringSkill.xp} XP</p>
        </div>
        <div className="gathering-tabs">
          <button
            className={`tab-button ${activeTab === 'minerals' ? 'active' : ''}`}
            onClick={() => setActiveTab('minerals')}
          >
            Minerals
          </button>
          <button
            className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>
        <div className="gathering-content">
          {activeTab === 'minerals' && (
            <div>
              <ul>
                {minerals.map(mineral => (
                  <li key={mineral.id} onClick={() => handleItemClick(mineral)}>
                    <span className="item-name">{mineral.name}</span>
                    <span className="item-rarity">{mineral.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'resources' && (
            <div>
              <ul>
                {resources.map(res => (
                  <li key={res.id} onClick={() => handleItemClick(res)}>
                    <span className="item-name">{res.name}</span>
                    <span className="item-rarity">{res.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {notificationMessage && (
        <div className="notification">
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default Gathering;
