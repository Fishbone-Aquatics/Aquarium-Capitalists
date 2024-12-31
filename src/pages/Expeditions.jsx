import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone, handleExpedition, resetStatistics, clearExpeditionIntervalId } from '../features/expeditions/expeditionSlice';
import { stopGatheringResource } from '../features/gathering/gatheringSlice';
import Zone from '../components/Zone'; // Adjust the import path as necessary
import '../styles/expeditions.css';

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const expeditionStartTime = useSelector((state) => state.expedition.statistics.expeditionStartTime);
  const currentExpeditionElapsedSeconds = useSelector((state) => state.expedition.statistics.currentExpeditionElapsedSeconds);
  const playerLevel = useSelector((state) => state.player.stats.level);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);

  useEffect(() => {
    const updateProgressBar = () => {
      if (activeZone && expeditionStartTime) {
        const zone = zones.find(zone => zone.name === activeZone);
        const totalDuration = zone.duration;

        const update = () => {
          const progress = (currentExpeditionElapsedSeconds / totalDuration) * 100;

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${currentExpeditionElapsedSeconds} / ${totalDuration} seconds`;
            console.log(`Elapsed seconds: ${currentExpeditionElapsedSeconds}, Total duration: ${totalDuration}, Progress: ${progress}%`);
          }
        };

        update();
      }
    };

    if (activeZone && expeditionStartTime) {
      updateProgressBar();
    }

    return () => {
    };
  }, [activeZone, zones, expeditionStartTime, dispatch, currentExpeditionElapsedSeconds]);

  const handleStart = (zoneName) => {
    console.log('start pressed')
    dispatch(stopGatheringResource());
    dispatch(resetStatistics());
    dispatch(setActiveZone({ zoneName }));
    dispatch(handleExpedition());
  };

  const handleStop = () => {
    dispatch(clearExpeditionIntervalId())
    dispatch(clearActiveZone());
    dispatch(resetStatistics());
    console.log('stop pressed')
  };

  return (
    <div>
      <div className="zones">
        {zones.map((zone, index) => (
          <Zone
            key={index}
            zone={zone}
            activeZone={activeZone}
            handleStart={handleStart}
            handleStop={handleStop}
            progressBarRef={progressBarRef}
            progressTextRef={progressTextRef}
            playerLevel={playerLevel} // Pass player level to Zone component
          />
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
