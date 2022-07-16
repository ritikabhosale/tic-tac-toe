const { createApp } = require('../src/app.js');
const request = require('supertest');

describe('GET /api/game', () => {
  const serverConfig = { root: '/public' };

  it('should serve game data.', (done) => {
    const gameData = {
      board: [],
      players: []
    }
    const games = {
      1: { gameId: 1, toJSON: () => JSON.stringify(gameData) },
      2: { gameId: 2, toJSON: () => JSON.stringify(gameData) }
    };
    const sessions = {
      '1': { sessionId: '1', username: 'a@b.c', gameId: '1' }
    };
    const req = request(createApp(serverConfig, sessions, games, () => { }, {}));
    req.get('/api/game/1')
      .set('Cookie', 'sessionId=1')
      .expect(200, gameData, done)
  });

  it('should redirect to /login if user is not logged in.', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, {}));
    req.get('/api/game/1')
      .expect('location', '/login')
      .expect(302, done)
  });

  it('should not serve game data if game doesn\'t exist.', (done) => {
    const status = { success: false, message: 'Game doesn\'t exist.' };
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, {}));
    req.get('/api/game/3')
      .set('Cookie', 'sessionId=1')
      .expect(404, status, done)
  });
});