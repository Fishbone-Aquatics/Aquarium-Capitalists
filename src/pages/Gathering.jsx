import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/gathering.css';
import items from '../data/items/items';
import { startGatheringResource, stopGatheringResource, handleGathering } from '../features/gathering/gatheringSlice';
import { clearActiveZone } from '../features/expeditions/expeditionSlice';
import { setNotificationMessage } from '../features/notifications/notificationSlice'; // Import the new notification actions
import { calculateLevelFromXP, getRequiredXPForLevel } from '../features/player/xpCalculator';
import Notification from '../components/Notification'; // Import the Notification component

const Gathering = () => {
  const [activeTab, setActiveTab] = useState('minerals');
  const dispatch = useDispatch();

  // Filter the items based on both type and category
  const minerals = Object.values(items.resource).filter(item => item.type.toLowerCase() === 'mineral');
  const resources = Object.values(items.resource).filter(item => item.type.toLowerCase() === 'resource' && item.category.toLowerCase() === 'resource');

  const initialSelectedItem = minerals.length > 0 ? minerals[0] : {
    id: 'silica',
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
  const activeResource = useSelector(state => state.gathering.activeResource);

  const currentXP = gatheringSkill.xp;
  const currentLevel = calculateLevelFromXP(currentXP);
  const requiredXPForCurrentLevel = currentLevel > 1 ? getRequiredXPForLevel(currentLevel - 1) : 0;
  const requiredXPForNextLevel = getRequiredXPForLevel(currentLevel);

  // Calculate current level progress
  const currentLevelProgress = currentXP - requiredXPForCurrentLevel;
  const xpForNextLevel = requiredXPForNextLevel - requiredXPForCurrentLevel;
  const xpPercentage = (currentLevelProgress / xpForNextLevel) * 100;

  const handleToggleGathering = async () => {
    if (activeResource) {
      dispatch(stopGatheringResource());
    } else {
      dispatch(clearActiveZone());
      dispatch(startGatheringResource({ resource: selectedItem }));
      dispatch(setNotificationMessage(`Starting gathering ${selectedItem.name}`));
      setTimeout(() => {
        dispatch(handleGathering());
      }, 0);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      type: item.type,
      image: item.image,
      duration: item.duration,
      gatheringDrops: item.gatheringDrops,
    });
  };

  return (
    <div className="gathering-container">
      <div className="gathering-column">
        <div className="gathering-header">
          <h2>{selectedItem.name}</h2>
          <div className="image-and-button">
            <div className="image-border">
              <img src={selectedItem.image} alt={selectedItem.name} />
            </div>
            <button className={`toggle-btn ${activeResource ? 'stop' : 'gather'} gather-button`} onClick={handleToggleGathering}>
              {activeResource ? 'Stop' : 'Gather'}
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
            className={`toggle-button ${activeTab === 'placeholder1' ? 'active' : ''}`}
            onClick={() => setActiveTab('placeholder1')}
          >
            Placeholder 1
          </button>
          <button
            className={`toggle-button ${activeTab === 'placeholder2' ? 'active' : ''}`}
            onClick={() => setActiveTab('placeholder2')}
          >
            Placeholder 2
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
          <p>Level: {currentLevel}</p>
          <p>XP Progress: {xpPercentage.toFixed(2)}% ({currentLevelProgress} / {xpForNextLevel} XP)</p>
          <p>Gathering Speed: +{(gatheringSpeed * 100).toFixed(2)}%</p>
          <p>Gathering Efficiency: +{(gatheringEfficiency * 100).toFixed(2)}%</p>
          <p>Total Gathering XP: {currentXP.toLocaleString()} XP</p>
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
      <Notification /> {/* Add Notification component */}
    </div>
  );
};

export default Gathering;
