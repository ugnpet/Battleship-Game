function generateBoard() {
    const boardSize = 10;
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    const ships = [
        { size: 5, count: 1 },
        { size: 4, count: 1 },
        { size: 3, count: 2 },
        { size: 2, count: 3 },
        { size: 1, count: 3 },
    ];

    let shipId = 1;

    ships.forEach((ship) => {
        for (let i = 0; i < ship.count; i++) {
            placeShip(board, ship.size, shipId++);
        }
    });

    return board;
}

function placeShip(board, size, shipId) {
    const boardSize = board.length;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
        attempts++;
        const isHorizontal = Math.random() < 0.5;
        const startX = Math.floor(Math.random() * (isHorizontal ? boardSize : boardSize - size + 1));
        const startY = Math.floor(Math.random() * (isHorizontal ? boardSize - size + 1 : boardSize));
        const endX = isHorizontal ? startX : startX + size - 1;
        const endY = isHorizontal ? startY + size - 1 : startY;

        if (canPlaceShip(board, startX, startY, endX, endY)) {
            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    board[x][y] = shipId;
                }
            }
            placed = true;
        }
    }

    if (!placed) {
        throw new Error(`Failed to place ship of size ${size} after ${maxAttempts} attempts.`);
    }
}

function canPlaceShip(board, startX, startY, endX, endY) {
    for (let x = Math.max(0, startX - 1); x <= Math.min(board.length - 1, endX + 1); x++) {
        for (let y = Math.max(0, startY - 1); y <= Math.min(board[0].length - 1, endY + 1); y++) {
            if (board[x][y] !== 0) {
                return false;
            }
        }
    }
    return true;
}

module.exports = { generateBoard };
