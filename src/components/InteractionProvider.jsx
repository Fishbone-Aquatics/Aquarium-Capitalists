import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const InteractionContext = createContext();

export const InteractionProvider = ({ children }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeAway, setTimeAway] = useState(0);

  // Access the player's last action from the Redux store
  const playerLastAction = useSelector((state) => state.player.lastAction);

  useEffect(() => {
    const handleInteraction = () => {
      console.log("Tab or page interaction detected.");
    };

    // Only proceed if `playerLastAction` exists
    if (playerLastAction) {
      console.log("Player last action:", playerLastAction);
      
      // Parse the ISO string directly
      const lastTimestamp = new Date(playerLastAction);
      const now = new Date();
      
      // Calculate the difference in seconds
      const diffInSeconds = Math.floor((now - lastTimestamp) / 1000);
      
      console.log("Time away:", diffInSeconds);
      setTimeAway(diffInSeconds);    

      // Show the popup if the time away is greater than 5 seconds
      if (diffInSeconds > 300) {
        setPopupVisible(true);
      }
    }

    // Listen for tab visibility changes or page unloads
    window.addEventListener("beforeunload", handleInteraction);
    document.addEventListener("visibilitychange", handleInteraction);

    return () => {
      window.removeEventListener("beforeunload", handleInteraction);
      document.removeEventListener("visibilitychange", handleInteraction);
    };
  }, [playerLastAction]); // Re-run the effect if `playerLastAction` changes

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <InteractionContext.Provider value={{ popupVisible, timeAway, handlePopupClose }}>
      {children}
    </InteractionContext.Provider>
  );
};
