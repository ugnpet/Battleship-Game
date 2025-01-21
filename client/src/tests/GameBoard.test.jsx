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

    expect(screen.getByText(/Shots:/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();
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

  await waitFor(() => screen.getByText(/25/i));

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      result: 'Game Over! You ran out of shots.',
      shotsLeft: 0,
    }),
  });

  const allCells = screen.getAllByRole('button', { name: '' });
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

  await waitFor(() => screen.getByText(/25/i));

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      result: 'Game Over! You ran out of shots.',
      shotsLeft: 0,
    }),
  });

  const cells = screen.getAllByRole('button', { name: '' });
  fireEvent.click(cells[0]);

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
    expect(screen.getByText(/25/i)).toBeInTheDocument();
  });
});

test('handles error during game initialization', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<GameBoard />);

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith('Error starting game:', expect.any(Error));
  });

  consoleSpy.mockRestore();
});

test('prevents cell click actions after game over', async () => {
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

  await waitFor(() => screen.getByText(/25/i));

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      result: 'Game Over! You ran out of shots.',
      shotsLeft: 0,
    }),
  });

  const cells = screen.getAllByRole('button', { name: '' });
  fireEvent.click(cells[0]);

  await waitFor(() => {
    expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
  });

  fetch.mockClear();
  fireEvent.click(cells[1]);
  expect(fetch).not.toHaveBeenCalled();
});

test('decrements shotsLeft and updates board on successful shot', async () => {
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

  await waitFor(() => screen.getByText(/25/i));
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      result: 'Miss',
      shotsLeft: 24,
    }),
  });

  const cells = screen.getAllByRole('button', { name: '' });
  fireEvent.click(cells[0]);
  await waitFor(() => {
    expect(screen.getByText(/24/i)).toBeInTheDocument();
  });
  expect(cells[0]).toHaveTextContent('•');
});
