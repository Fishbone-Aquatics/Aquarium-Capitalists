import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone, handleExpedition } from '../features/expeditions/expeditionSlice';
import { stopGatheringResource } from '../features/gathering/gatheringSlice';
import '../styles/expeditions.css';

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);

  const handleStart = (zoneName) => {
    dispatch(stopGatheringResource());
    dispatch(clearActiveZone());
    dispatch(setActiveZone({ zoneName }));
    dispatch(handleExpedition());
  };

  const handleStop = () => {
    dispatch(clearActiveZone());
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
