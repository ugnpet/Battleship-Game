import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GameBoard from '../components/GameBoard';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('initializes a new game and displays board', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      gameId: 'testGame',
      board: [
        [0, 0],
        [0, 0],
      ],
    }),
  });

  render(<GameBoard />);

  expect(fetch).toHaveBeenCalledWith('/api/game/new-game', expect.any(Object));
  await waitFor(() => {
    expect(screen.getByText(/Likę šūviai: 25/i)).toBeInTheDocument();
  });
});

test('renders restart button if message includes "Game Over"', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      gameId: 'testGame',
      board: [
        [0, 0],
        [0, 0],
      ],
    }),
  });

  render(<GameBoard />);

  await waitFor(() => screen.getByText(/Likę šūviai: 25/i));
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      result: 'Game Over! You ran out of shots.',
      shotsLeft: 0,
    }),
  });

  const cell = screen.getAllByRole('button')[0];
  const allCells = screen.getAllByText('', { selector: 'div.cell' });
  fireEvent.click(allCells[0]);

  await waitFor(() => {
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
  });

  expect(screen.getByText(/Restart Game/i)).toBeInTheDocument();
});

test('RestartButton triggers game reinitialization', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      gameId: 'initialGame',
      board: [
        [0, 0],
        [0, 0],
      ],
    }),
  });

  render(<GameBoard />);

  await waitFor(() => screen.getByText(/Likę šūviai: 25/i));
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      result: 'Game Over! You ran out of shots.',
      shotsLeft: 0,
    }),
  });

  const allCells = screen.getAllByText('', { selector: 'div.cell' });
  fireEvent.click(allCells[0]);

  await waitFor(() => {
    expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
  });

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      gameId: 'newGame',
      board: [
        [0, 0],
        [0, 0],
      ],
    }),
  });

  fireEvent.click(screen.getByText(/Restart Game/i));
  await waitFor(() => {
    expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
  });
});
