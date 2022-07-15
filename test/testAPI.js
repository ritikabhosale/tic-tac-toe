const { createApp } = require('../src/app.js');
const request = require('supertest');

describe('GET /api/game', () => {
  const serverConfig = { root: '/public' };

  it('should serve game data.', (done) => {
    const gameData = {
      board: [],
      players: []
    }
    const games = { 1: { gameId: 1, toJSON: () => JSON.stringify(gameData) } };
    const sessions = {
      '1': { sessionId: '1', username: 'a@b.c', gameId: '1' }
    };
    const req = request(createApp(serverConfig, sessions, games, () => { }, {}));
    req.get('/api/game')
      .set('Cookie', 'sessionId=1')
      .expect(200, gameData, done)
  });

  it('should redirect to /login if user is not logged in.', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, {}));
    req.get('/api/game')
      .expect('location', '/login')
      .expect(302, done)
  });

  it('should not serve game data if user is not attached to a game.', (done) => {
    const status = { success: false, message: 'You are not part of any game' };
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, {}));
    req.get('/api/game')
      .set('Cookie', 'sessionId=1')
      .expect(409, status, done)
  });
});