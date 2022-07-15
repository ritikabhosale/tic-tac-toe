const { createApp } = require('../src/app.js');
const request = require('supertest');

describe('GET /host', () => {
  it('should redirect to login', (done) => {
    const serverConfig = { root: '/public' };

    const res = request(createApp(serverConfig, {}, {}, () => { }, {}));
    res.get('/host')
      .expect('location', '/login')
      .expect(302, done)
  });

  it('should redirect to game', (done) => {
    const serverConfig = { root: '/public' };
    const games = {};
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const res = request(createApp(serverConfig, sessions, games, () => { }, {}));

    res.get('/host')
      .set('cookie', 'sessionId=1')
      .expect('location', '/game')
      .expect(302, done)
  });
});
