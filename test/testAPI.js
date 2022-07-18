const { createApp } = require('../src/app.js');
const request = require('supertest');
const assert = require('assert');

const mockReadFileSync = (expectedFile, expectedEncoding, content) => {
  return (fileName, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    return content;
  };
};

describe('GET /api/game', () => {
  const serverConfig = { root: '/public', usersData: './data/users.json' };
  let cookie;
  const users = { rishabh: { username: 'rishabh', password: 'ris' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync('./data/users.json', 'utf8', JSON.stringify(users)),
  };

  const gameData = {
    board: [],
    players: []
  }
  const games = {
    1: { gameId: 1, toJSON: () => JSON.stringify(gameData) },
    2: { gameId: 2, toJSON: () => JSON.stringify(gameData) }
  };
  const app = createApp(serverConfig, games, fs);

  beforeEach((done) => {
    const loginRequest = request(app);
    loginRequest.post('/login')
      .send('username=rishabh&password=ris')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      });
  })

  it('should serve game data.', (done) => {
    const req = request(app);
    req.get('/api/game/1')
      .set('Cookie', cookie)
      .expect(200, gameData, done)
  });

  it('should redirect to /login if user is not logged in.', (done) => {
    const req = request(createApp(serverConfig, {}, {}));
    req.get('/api/game/1')
      .expect('location', '/login')
      .expect(302, done)
  });

  it('should not serve game data if game doesn\'t exist.', (done) => {
    const status = { success: false, message: 'Game doesn\'t exist.' };
    const req = request(app);

    req.get('/api/game/3')
      .set('Cookie', cookie)
      .expect(404, status, done)
  });
});