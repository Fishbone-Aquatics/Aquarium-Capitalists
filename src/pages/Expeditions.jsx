import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone, handleExpedition, resetStatistics } from '../features/expeditions/expeditionSlice';
import { stopGatheringResource } from '../features/gathering/gatheringSlice';
import Zone from '../components/Zone'; // Adjust the import path as necessary
import '../styles/expeditions.css';

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateProgressBar = () => {
      if (activeZone) {
        const zone = zones.find(zone => zone.name === activeZone);
        const totalDuration = zone.duration;
        startTimeRef.current = Date.now();

        console.log('Starting interval for progress update');

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const progress = (elapsedSeconds / totalDuration) * 100;

          console.log(`Elapsed seconds: ${elapsedSeconds}, Progress: ${progress}%`);

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${elapsedSeconds} / ${totalDuration} seconds`;
          }

          if (elapsedSeconds >= totalDuration) {
            clearInterval(intervalRef.current);
            console.log('Expedition completed, clearing interval');

            setTimeout(() => {
              dispatch(handleExpedition());
              resetProgressBar();
              updateProgressBar(); // Restart after resetting
            }, 1000); // 1-second delay before resetting the progress bar
          }
        }, 1000);
      }
    };

    const resetProgressBar = () => {
      console.log('Resetting progress bar');
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

    if (activeZone) {
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
  }, [activeZone, zones, dispatch]);

  const handleStart = (zoneName) => {
    console.log('Starting expedition in zone:', zoneName);
    dispatch(stopGatheringResource()); // we need a util / helper for this lol
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
