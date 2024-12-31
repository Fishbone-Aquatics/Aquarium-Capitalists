import React, { useContext } from "react";
import { InteractionContext } from "./InteractionProvider";

const PopupComponent = () => {
  const { popupVisible, timeAway, handlePopupClose } = useContext(InteractionContext);

  return (
    popupVisible && (
      <div className="popup">
        <h2>Welcome back!</h2>
        <p>You were away for {timeAway} seconds.</p>
        <button onClick={handlePopupClose}>Close</button>
      </div>
    )
  );
};

export default PopupComponent;
