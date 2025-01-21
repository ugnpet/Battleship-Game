const express = require('express');
const { generateBoard } = require('../utils/boardGenerator');
const router = express.Router();

router.get('/generate-board', (req, res) => {
  const board = generateBoard();
  res.json(board);
});

module.exports = router;
