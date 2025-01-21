const express = require('express');
const { generateBoard } = require('../utils/boardGenerator');
const router = express.Router();
const {
  isGameOver,
  markCell,
  isShipSunk,
  checkVictory,
  handleGameOver,
} = require('../utils/Helpers');

const games = {};

// 1. New Game
router.post('/new-game', (req, res) => {
  const gameId = Math.random().toString(36).substring(7);
  const board = generateBoard();
  games[gameId] = {
    board,
    shotsLeft: 25,
    shipsRemaining: 10,
    gameOver: false,
  };
  res.json({ gameId, board });
});

// 2. Shoot
router.post('/shoot', (req, res) => {
  const { gameId, x, y } = req.body;

  if (!games[gameId]) {
    return res.status(404).json({ error: 'Game not found.' });
  }

  const game = games[gameId];
  if (game.gameOver) {
    return res.status(400).json({ error: 'The game is already over.' });
  }

  const cell = game.board[x][y];
  if (cell < 0) {
    return res.status(400).json({ error: 'Already shot at this position.' });
  }

  if (cell === 0) {
    markCell(game.board, x, y, -1);
    game.shotsLeft--;

    if (isGameOver(game)) {
      console.log('Game Over Condition:', game);
      return res.json(handleGameOver(game, 'Game Over! You ran out of shots.'));
    }

    return res.json({ result: 'Miss', shotsLeft: game.shotsLeft });
  } else if (cell > 0) {
    const shipId = cell;
    markCell(game.board, x, y, -2);

    if (isShipSunk(game.board, shipId)) {
      game.shipsRemaining--;

      const victoryMessage = checkVictory(game);
      if (victoryMessage) {
        return res.json(handleGameOver(game, victoryMessage));
      }

      return res.json({ result: 'Sunk', shotsLeft: game.shotsLeft });
    }

    return res.json({ result: 'Hit', shotsLeft: game.shotsLeft });
  }
});

if (process.env.NODE_ENV === 'test') {
  router.post('/set-cell', (req, res) => {
    const { gameId, x, y, value } = req.body;
    if (!games[gameId]) {
      return res.status(404).json({ error: 'Game not found.' });
    }
    games[gameId].board[x][y] = value;
    res.json({ gameId, x, y, value });
  });
}

module.exports = router;
