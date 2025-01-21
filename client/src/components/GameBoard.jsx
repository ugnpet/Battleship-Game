import React, { useEffect, useState } from 'react';
import '../styles/GameBoard.css';
import RestartButton from './RestartButton';

const GameBoard = () => {
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [message, setMessage] = useState('');
  const [shotsLeft, setShotsLeft] = useState(0);

  const initializeGame = () => {
    fetch('/api/game/new-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setGameId(data.gameId);
        setBoard(data.board);
        setShotsLeft(25);
        setMessage('');
      })
      .catch((err) => {
        console.error('Error starting game:', err);
      });
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCellClick = (rowIndex, colIndex) => {
    if (!gameId || shotsLeft <= 0) return;
    if (message.includes('Game Over')) return;

    fetch('/api/game/shoot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, x: rowIndex, y: colIndex }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          return;
        }
        setBoard((prevBoard) => {
          const newBoard = prevBoard.map((row) => [...row]);
          newBoard[rowIndex][colIndex] =
            data.result === 'Miss'
              ? -1
              : data.result === 'Hit'
              ? -2
              : -2;
          return newBoard;
        });
        setShotsLeft(data.shotsLeft);
        setMessage(data.result || '');
      })
      .catch((err) => {
        console.error('Error sending request:', err);
      });
  };

  return (
    <div className="game-container">
      <h1 className="title">Battleship Game</h1>
      <div className="status-bar">
        <div className="status-message">
          {message ? message : 'Good luck!'}
        </div>
        <div className="status-shots">
          <span className="shots-label">Shots:</span>
          <span className="shots-value">{shotsLeft}</span>
        </div>
      </div>
      
      {(message.includes('Game Over') || message.includes('Win') || message.includes('over')) && (
        <div className="restart-button-container">
          <RestartButton onRestart={initializeGame} />
        </div>
      )}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              let cellContent = '';
              let cellClass = 'cell';
              // 0 – empty; -1 – missed; -2 – hit
              if (cell === -1) {
                cellContent = '•';
                cellClass += ' missed';
              } else if (cell === -2) {
                cellContent = 'X';
                cellClass += ' hit';
              }
              return (
                <div
                  key={colIndex}
                  className={cellClass}
                  role="button"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cellContent}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
