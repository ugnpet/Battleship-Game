const { isGameOver, isShipSunk } = require('../utils/Helpers');

test('isGameOver returns true when shotsLeft is 0', () => {
  const game = { shotsLeft: 0, shipsRemaining: 5 };
  expect(isGameOver(game)).toBe(true);
});

test('isGameOver returns true when shipsRemaining is 0', () => {
  const game = { shotsLeft: 10, shipsRemaining: 0 };
  expect(isGameOver(game)).toBe(true);
});

test('isGameOver returns false when game is still ongoing', () => {
  const game = { shotsLeft: 10, shipsRemaining: 5 };
  expect(isGameOver(game)).toBe(false);
});

test('isShipSunk returns true if ship is sunk', () => {
  const board = [
    [0, 0, -2],
    [0, 0, -2],
    [0, 0, -2],
  ];
  expect(isShipSunk(board, 1)).toBe(true);
});

test('isShipSunk returns false if ship is not sunk', () => {
  const board = [
    [0, 0, 1],
    [0, 0, -2],
    [0, 0, 1],
  ];
  expect(isShipSunk(board, 1)).toBe(false);
});
