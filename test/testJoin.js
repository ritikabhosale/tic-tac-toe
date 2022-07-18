const { createApp } = require('../src/app.js');
const request = require('supertest');
const assert = require('assert');

const mockReadFileSync = (expected, expectedEncoding) => {
  let index = 0;
  return (fileName, encoding) => {
    const { content, file } = expected[index];
    assert.strictEqual(fileName, file);
    assert.strictEqual(encoding, expectedEncoding);
    index++;
    return content;
  };
};

describe('GET /join', () => {
  const serverConfig = { root: '/public', usersData: './data/users.json' };
  let cookie;
  const users = { rishabh: { username: 'rishabh', password: 'ris' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync([
      { file: './data/users.json', content: JSON.stringify(users) },
      { file: './src/app/template/join.html', content: 'join template' }
    ], 'utf8')
  };
  const app = createApp(serverConfig, {}, fs);

  before((done) => {
    const loginRequest = request(app);
    loginRequest.post('/login')
      .send('username=rishabh&password=ris')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      });
  });

  it('should serve the join page', (done) => {
    const req = request(app);
    req.get('/join')
      .set('Cookie', cookie)
      .expect(200, 'join template', done)
  });

  it('should redirect to login when user is not logged in', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    req.get('/join')
      .expect('location', '/login')
      .expect(302, done)
  });
});

describe('POST /join', () => {
  const serverConfig = { root: '/public', usersData: './data/users.json' };
  let cookie;
  const users = { rishabh: { username: 'rishabh', password: 'ris' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync([
      { file: './data/users.json', content: JSON.stringify(users) }
    ], 'utf8')
  };

  const games = {
    '0': {
      gameId: 0,
      isSpotAvailable: () => true,
      addPlayer: () => { }
    }
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
  });

  it('should redirect to login when user is not logged in', (done) => {
    const req = request(app);
    req.post('/join')
      .expect('location', '/login')
      .expect(302, done)
  });

  it('should redirect to /game when user enter valid join id', (done) => {
    const req = request(app);
    req.post('/join')
      .set('cookie', cookie)
      .send('game-id=0')
      .expect('location', '/game/0')
      .expect(302, done)
  });

  it('should send status as 422 when spot is unavailable in game', (done) => {
    games['0'].isSpotAvailable = () => false;
    const status = { success: false, message: 'Game already has two players.' };
    const req = request(app);
    req.post('/join')
      .set('cookie', cookie)
      .send('game-id=0')
      .expect(422, status, done)
  });

  it('should send status as 422 when game is not available', (done) => {
    const status = { success: false, message: 'Game doesn\'t exist.' };
    const req = request(app);
    req.post('/join')
      .set('cookie', cookie)
      .send('game-id=1')
      .expect(404, status, done)
  });
});
