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
  }
};

const mockReadFileSync = (expectedFile, expectedEncoding, content) => {
  return (fileName, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    return content;
  }
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

describe('GET /hello.txt', () => {
  const serverConfig = { root: '/public' };
  const fs = {
    readFile: mockReadFile('/public/hello.txt', 'hello'),
    readFileSync: () => { },
  };

  it('should route to  hello.txt', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/hello.txt')
      .expect(200, 'hello', done)
      .expect('content-type', /plain/)
  });

  it('should route to not found for bye.txt', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/bye.txt')
      .expect(404, 'Page Not Found', done)
      .expect('content-type', /plain/)
  });
});

describe('GET /login', () => {
  const serverConfig = { root: '/public' };
  const fs = {
    readFile: mockReadFile('/public/hello.txt', 'hello'),
    readFileSync: mockReadFileSync('./src/app/template/login.html', 'utf8', 'template')
  };

  it('should serve login page', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/login')
      .expect(200, 'template', done)
      .expect('content-type', /html/)
  });

  it('should send a message of already logged in.', (done) => {
    const sessions = { '1': { sessionId: '1', email: 'a@b.c', time: '123456' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, fs));
    req.get('/login')
      .set('Cookie', ['sessionId=1'])
      .expect(200, 'You are already logged in.', done)
      .expect('content-type', /plain/)
  });
});

describe('POST /login', () => {
  const serverConfig = { root: '/someDir' };
  it('should redirect to /play-game', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, {}));
    req.post('/login')
      .send('email=a@b.c&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(302, done)
      .expect('location', '/play-game')
      .expect('content-type', /html/)
  });

  it('should redirect send message already logged in', (done) => {
    const sessions = { '1': { sessionId: '1', email: 'a@b.c', time: '12345' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, {}));
    req.post('/login')
      .set('Cookie', ['sessionId=1'])
      .expect(200, 'You are already logged in.', done)
      .expect('content-type', /plain/)
  });
});
