// src/components/ConfirmationModal.jsx
import React from 'react';
import '../styles/confirmationmodal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-message">{message}</div>
      <div className="confirmation-buttons">
        <button onClick={onConfirm}>Continue</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
