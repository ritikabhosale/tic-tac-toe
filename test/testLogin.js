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

  it('should redirect to home page when already logged in.', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, fs));
    req.get('/login')
      .set('Cookie', ['sessionId=1'])
      .expect(302, done)
  });
});

describe('POST /login', () => {
  const serverConfig = { root: '/someDir', usersData: '/data/users.json' };
  const users = { 'abc': { username: 'abc', password: '123' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync(
      '/data/users.json',
      'utf8',
      JSON.stringify(users)),
  };

  it('should redirect to /play-game', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.post('/login')
      .send('username=abc&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(302, done)
      .expect('location', '/play-game')
      .expect('content-type', /html/)
  });

  it('should not allow unauthenticated user', (done) => {
    const status = { success: false, message: 'Invalid username or password' };
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.post('/login')
      .send('username=abcd&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(422, status, done)
      .expect('content-type', /json/)
  });

  it('should not allow if mandatory fields are empty', (done) => {
    const status = { success: false, message: 'All fields required' };
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(400, status, done)
      .expect('content-type', /json/)
  });

  it('should redirect send message already logged in', (done) => {
    const sessions = { '1': { sessionId: '1', username: 'a@b.c', time: '12' } };
    const req = request(createApp(serverConfig, sessions, {}, () => { }, fs));
    req.post('/login')
      .set('Cookie', ['sessionId=1'])
      .expect(302, done)
      .expect('content-type', /html/)
  });
});
