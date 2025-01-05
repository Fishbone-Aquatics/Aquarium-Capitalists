import React, { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateLastAction } from "../features/player/playerSlice";

export const InteractionContext = createContext();

export const InteractionProvider = ({ children }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [timeAway, setTimeAway] = useState(0);

  const playerLastAction = useSelector((state) => state.player.lastAction);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page became active again.");

        if (playerLastAction) {
          const lastTimestamp = new Date(playerLastAction);
          const now = new Date();
          const diffInSeconds = Math.floor((now - lastTimestamp) / 1000);

          console.log("Time away:", diffInSeconds);
          setTimeAway(diffInSeconds);

          // Show the popup if time away > 5 minutes OR the page was just reactivated
          if (diffInSeconds > 300 || document.visibilityState === "visible") {
            setPopupVisible(true);
          }
        }
      }
    };

    const handleBeforeUnload = () => {
      console.log("Tab or page is being unloaded.");
      dispatch(updateLastAction(new Date().toISOString())); // Save current timestamp to Redux
    };

    const handlePageLoad = () => {
      console.log("Page reloaded.");
      if (playerLastAction) {
        const lastTimestamp = new Date(playerLastAction);
        const now = new Date();
        const diffInSeconds = Math.floor((now - lastTimestamp) / 1000);

        console.log("Time away after refresh:", diffInSeconds);
        setTimeAway(diffInSeconds);

        // Show the popup if the page was refreshed recently
        //setPopupVisible(true);
      }
    };

    // Listen for page load, visibility change, and beforeunload
    window.addEventListener("load", handlePageLoad);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("load", handlePageLoad);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playerLastAction, dispatch]);

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <InteractionContext.Provider value={{ popupVisible, timeAway, handlePopupClose }}>
      {children}
    </InteractionContext.Provider>
  );
};
