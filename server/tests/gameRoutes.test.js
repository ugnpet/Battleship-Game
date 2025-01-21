const request = require('supertest');
const express = require('express');
const router = require('../routes/gameRoutes');
const app = express();
app.use(express.json());
app.use('/api/game', router);

describe('Game Routes', () => {
    let gameId;

    beforeEach(async () => {
        const res = await request(app).post('/api/game/new-game');
        gameId = res.body.gameId;
    });

    test('POST /api/game/new-game should create a new game with proper properties', async () => {
        const response = await request(app).post('/api/game/new-game');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('gameId');
        expect(response.body).toHaveProperty('board');
    });

    test('POST /api/game/shoot should handle a valid shot that is a miss', async () => {
        await request(app)
            .post('/api/game/set-cell')
            .send({ gameId, x: 0, y: 0, value: 0 });

        const response = await request(app)
            .post('/api/game/shoot')
            .send({ gameId, x: 0, y: 0 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('result', 'Miss');
        expect(response.body).toHaveProperty('shotsLeft');
    });

    test('POST /api/game/shoot should handle a valid hit (but not sunk)', async () => {
        await request(app)
            .post('/api/game/set-cell')
            .send({ gameId, x: 1, y: 1, value: 3 });

        const response = await request(app)
            .post('/api/game/shoot')
            .send({ gameId, x: 1, y: 1 });

        expect(response.status).toBe(200);
        expect(['Hit', 'Sunk']).toContain(response.body.result);
        expect(response.body).toHaveProperty('shotsLeft');
    });

    test('POST /api/game/shoot should return error if shooting the same cell twice', async () => {
        await request(app)
            .post('/api/game/set-cell')
            .send({ gameId, x: 2, y: 2, value: 0 });

        const firstResponse = await request(app)
            .post('/api/game/shoot')
            .send({ gameId, x: 2, y: 2 });
        expect(firstResponse.status).toBe(200);
        expect(firstResponse.body).toHaveProperty('result', 'Miss');

        const secondResponse = await request(app)
            .post('/api/game/shoot')
            .send({ gameId, x: 2, y: 2 });
        expect(secondResponse.status).toBe(400);
        expect(secondResponse.body).toHaveProperty('error', 'Already shot at this position.');
    });

    test('POST /api/game/shoot should handle game over condition when shots run out', async () => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                await request(app)
                    .post('/api/game/set-cell')
                    .send({ gameId, x: i, y: j, value: 0 });
            }
        }

        let lastResponse;
        for (let shot = 0; shot < 25; shot++) {
            lastResponse = await request(app)
                .post('/api/game/shoot')
                .send({ gameId, x: Math.floor(shot / 5), y: shot % 5 });
        }

        expect(lastResponse.status).toBe(200);
        expect(lastResponse.body).toHaveProperty('result');
        expect(lastResponse.body.result).toMatch(/Game Over!/);
    });

    test('POST /api/game/shoot should return error when game not found', async () => {
        const response = await request(app)
            .post('/api/game/shoot')
            .send({ gameId: 'nonexistent', x: 0, y: 0 });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Game not found.');
    });

    test('POST /api/game/shoot should return error when shooting after game is over', async () => {
        await request(app)
            .post('/api/game/set-cell')
            .send({ gameId, x: 0, y: 0, value: 0 });

        for (let shot = 0; shot < 25; shot++) {
            const x = Math.floor(shot / 5);
            const y = shot % 5;
            await request(app)
                .post('/api/game/set-cell')
                .send({ gameId, x, y, value: 0 });
            await request(app)
                .post('/api/game/shoot')
                .send({ gameId, x, y });
        }

        const response = await request(app)
            .post('/api/game/shoot')
            .send({ gameId, x: 0, y: 0 });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'The game is already over.');
    });
});
