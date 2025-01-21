const { generateBoard } = require('../utils/boardGenerator');

describe('Board Generator', () => {
    let board;

    beforeEach(() => {
        board = generateBoard();
    });

    test('should generate a 10x10 board', () => {
        expect(board.length).toBe(10);
        expect(board.every(row => row.length === 10)).toBe(true);
    });

    test('should place the correct number of ship cells', () => {
        const shipCells = board.flat().filter(cell => cell !== 0).length;
        const expectedShipCells = 3 + 6 + 6 + 4 + 5;
        expect(shipCells).toBe(expectedShipCells);
    });

    test('ships should not overlap or touch each other', () => {
        const isValidPlacement = (x, y) => {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (
                        nx >= 0 &&
                        nx < board.length &&
                        ny >= 0 &&
                        ny < board[0].length &&
                        board[nx][ny] !== 0 &&
                        board[nx][ny] !== board[x][y]
                    ) {
                        return false;
                    }
                }
            }
            return true;
        };

        let isValid = true;

        outerLoop: for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[x].length; y++) {
                if (board[x][y] !== 0 && !isValidPlacement(x, y)) {
                    isValid = false;
                    break outerLoop;
                }
            }
        }

        expect(isValid).toBe(true);
    });
});
