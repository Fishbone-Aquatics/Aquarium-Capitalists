import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone, handleExpedition, resetStatistics, incrementElapsedSeconds, selectElapsedSeconds } from '../features/expeditions/expeditionSlice';
import { stopGatheringResource } from '../features/gathering/gatheringSlice';
import Zone from '../components/Zone'; // Adjust the import path as necessary
import '../styles/expeditions.css';

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const expeditionStartTime = useSelector((state) => state.expedition.expeditionStartTime);
  const elapsedSeconds = useSelector(selectElapsedSeconds);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateProgressBar = () => {
      if (activeZone && expeditionStartTime) {
        const zone = zones.find(zone => zone.name === activeZone);
        const totalDuration = zone.duration;

        const update = () => {
          const progress = (elapsedSeconds / totalDuration) * 100;

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${elapsedSeconds} / ${totalDuration} seconds`;
            console.log('progress bar elapsedSeconds:', elapsedSeconds);
          }

          if (elapsedSeconds >= totalDuration) {
            console.log('Expedition cycle completed, resetting progress bar');
            resetProgressBar();
            dispatch(handleExpedition());
            setTimeout(() => {
              dispatch(setActiveZone({ zoneName: activeZone })); // Restart the expedition
              dispatch(handleExpedition());
            }, 1000);
          }
        };

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        update(); // Initial call to update progress immediately

        intervalRef.current = setInterval(() => {
          dispatch(incrementElapsedSeconds());
        }, 1000);
      }
    };

    const resetProgressBar = () => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = '0%';
      }
      if (progressTextRef.current) {
        const zone = zones.find(zone => zone.name === activeZone);
        if (zone) {
          progressTextRef.current.textContent = `0 / ${zone.duration} seconds`;
        }
      }
    };

    if (activeZone && expeditionStartTime) {
      console.log('Active zone:', activeZone);
      updateProgressBar();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('Interval cleared on component unmount');
      }
    };
  }, [activeZone, zones, expeditionStartTime, dispatch, elapsedSeconds]);

  const handleStart = (zoneName) => {
    console.log('Starting expedition in zone:', zoneName);
    dispatch(stopGatheringResource());
    dispatch(resetStatistics());
    dispatch(setActiveZone({ zoneName }));
    dispatch(handleExpedition());
  };

  const handleStop = () => {
    console.log('Stopping expedition');
    dispatch(clearActiveZone());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Interval cleared on stop');
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
          />
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
