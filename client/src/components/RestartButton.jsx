import React from 'react';
import '../styles/RestartButton.css'; 

const RestartButton = ({ onRestart }) => {
  return (
    <button className="restart-button" onClick={onRestart}>
      Restart Game
    </button>
  );
};

export default RestartButton;
