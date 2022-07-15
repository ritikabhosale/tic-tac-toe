const { createApp } = require('../src/app.js');
const request = require('supertest');
const assert = require('assert');

const mockReadFile = (expectedFile, content) => {
  return (fileName, callback) => {
    try {
      assert.strictEqual(fileName, expectedFile);
    } catch (error) {
      const err = 'can\'t read file';
      callback(err);
      return;
    }
    callback(null, content);
  };
};

const mockReadFileSync = (expectedFile, expectedEncoding, content) => {
  return (fileName, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    return content;
  };
};

describe('GET /abc', () => {
  const serverConfig = { root: '/someDir' };
  const fs = {
    readFile: mockReadFile('./someDir/hello', 'hello'),
    readFileSync: () => { },
  };

  it('should route to not found', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/abc')
      .expect(404, 'Page Not Found', done)
      .expect('content-type', /plain/)
  });
});

describe('GET /index.html', () => {
  const serverConfig = { root: './public' };
  it('should route to  index.html', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, {}));
    req.get('/index.html')
      .expect(200, done)
      .expect('content-type', /html/)
  });

  it('should route to not found for bye.txt', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, {}));
    req.get('/bye.txt')
      .expect(404, 'Page Not Found', done)
      .expect('content-type', /plain/)
  });
});

describe('GET /logout', () => {
  const serverConfig = { root: '/public' };
  const fs = {
    readFile: () => { },
    readFileSync: () => { },
  };

  it('should send setCookie header with maxage 0.', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, fs));
    req.get('/logout')
      .set('Cookie', ['sessionId=1'])
      .expect(302, done)
      .expect('set-cookie', 'sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  });

  it('should redirect to home page if user tries to logout without logging in', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/logout')
      .expect(302, done)
      .expect('location', '/')
  });
});

describe('GET /join', () => {
  const serverConfig = { root: '/public' };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync('./src/app/template/join.html', 'utf8', 'join template'),
  };

  it('should serve the join page', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, fs));
    req.get('/join')
      .set('Cookie', ['sessionId=1'])
      .expect(200, 'join template', done)
  });

  it('should redirect to login when user is not logged in', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/join')
      .expect('location', '/login')
      .expect(302, done)
  });
});

describe('POST /join', () => {
  const serverConfig = { root: '/public' };
  const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };

  it('should redirect to login when user is not logged in', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, {}));
    req.post('/join')
      .expect('location', '/login')
      .expect(302, done)
  });

  it('should redirect to /game when user enter valid join id', (done) => {
    const games = {
      '0': {
        gameId: 0,
        isSpotAvailable: () => true,
        addPlayer: () => { }
      }
    };

    const req = request(createApp(serverConfig, sessions, games, () => { }, {}));
    req.post('/join')
      .set('cookie', 'sessionId=1')
      .send('game-id=0')
      .expect('location', '/game')
      .expect(302, done)
  });

  it('should send status as 422 when spot is unavailable in game', (done) => {
    const status = { success: false, message: 'Game already has two players.' };
    const games = {
      '0': {
        gameId: 0,
        isSpotAvailable: () => false,
        addPlayer: () => { }
      }
    };

    const req = request(createApp(serverConfig, sessions, games, () => { }, {}));
    req.post('/join')
      .set('cookie', 'sessionId=1')
      .send('game-id=0')
      .expect(422, status, done)
  });

  it('should send status as 422 when spot is unavailable in game', (done) => {
    const status = { success: false, message: 'Game doesn\'t exist.' };
    const games = {
      '0': {
        gameId: 0,
        isSpotAvailable: () => false,
        addPlayer: () => { }
      }
    };

    const req = request(createApp(serverConfig, sessions, games, () => { }, {}));
    req.post('/join')
      .set('cookie', 'sessionId=1')
      .send('game-id=1')
      .expect(404, status, done)
  });
});
