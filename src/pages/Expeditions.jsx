import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone, handleExpedition, resetStatistics, incrementcurrentExpeditionElapsedSeconds, selectcurrentExpeditionElapsedSeconds } from '../features/expeditions/expeditionSlice';
import { stopGatheringResource } from '../features/gathering/gatheringSlice';
import Zone from '../components/Zone'; // Adjust the import path as necessary
import '../styles/expeditions.css';

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const expeditionStartTime = useSelector((state) => state.expedition.statistics.expeditionStartTime);
  const currentExpeditionElapsedSeconds = useSelector(selectcurrentExpeditionElapsedSeconds);
  const playerLevel = useSelector((state) => state.player.stats.level);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const intervalRef = useRef(null);

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
          }
        };

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        update(); // Initial call to update progress immediately

        intervalRef.current = setInterval(() => {
          dispatch(incrementcurrentExpeditionElapsedSeconds());
          update(); // Update progress bar on each interval tick
        }, 1000);
      }
    };

    if (activeZone && expeditionStartTime) {
      updateProgressBar();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeZone, zones, expeditionStartTime, dispatch, currentExpeditionElapsedSeconds]);

  const handleStart = (zoneName) => {
    dispatch(stopGatheringResource());
    dispatch(resetStatistics());
    dispatch(setActiveZone({ zoneName }));
    dispatch(handleExpedition());
  };

  const handleStop = () => {
    dispatch(clearActiveZone());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
