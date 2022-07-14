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
      .expect('set-cookie', 'sessionId=0;max-age:0')
  });

  it('should redirect to home page if user tries to logout without logging in', (done) => {
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/logout')
      .expect(302, done)
      .expect('location', '/')
  });
});
