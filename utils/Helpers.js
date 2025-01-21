const isGameOver = (game) => game.shotsLeft <= 0 || game.shipsRemaining === 0;

const markCell = (board, x, y, value) => {
    board[x][y] = value;
};

const isShipSunk = (board, shipId) => !board.flat().includes(shipId);

const checkVictory = (game) => {
    if (game.shipsRemaining === 0) {
        game.gameOver = true;
        return 'You Win! All ships destroyed.';
    }
    return null;
};

const handleGameOver = (game, result) => {
    game.gameOver = true;
    return {
        result,
        shotsLeft: game.shotsLeft,
        board: game.board,
    };
};

module.exports = {
    isGameOver,
    markCell,
    isShipSunk,
    checkVictory,
    handleGameOver,
};
