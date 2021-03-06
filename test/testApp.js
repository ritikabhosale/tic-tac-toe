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
    const req = request(createApp(serverConfig, {}, fs));
    req.get('/abc')
      .expect(404, 'Page Not Found', done)
      .expect('content-type', /plain/)
  });
});

describe('GET /index.html', () => {
  const serverConfig = { root: './public' };
  it('should route to  index.html', (done) => {
    const req = request(createApp(serverConfig, {}, {}));
    req.get('/index.html')
      .expect(200, done)
      .expect('content-type', /html/)
  });

  it('should route to not found for bye.txt', (done) => {
    const req = request(createApp(serverConfig, {}, {}));
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

  it('should redirect to home page if user tries to logout without logging in', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    req.get('/logout')
      .expect(302, done)
      .expect('location', '/')
  });
});

