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
  it('should route to  hello.txt', (done) => {
    const serverConfig = { root: '/public' };
    const fs = {
      readFile: mockReadFile('/public/hello.txt', 'hello'),
      readFileSync: () => { },
    };
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/hello.txt')
      .expect(200, 'hello', done)
      .expect('content-type', /plain/)
  });

  it('should route to not found for bye.txt', (done) => {
    const serverConfig = { root: '/public' };
    const fs = {
      readFile: mockReadFile('/public/hello.txt', 'hello'),
      readFileSync: () => { },
    };
    const req = request(createApp(serverConfig, {}, {}, () => { }, fs));
    req.get('/bye.txt')
      .expect(404, 'Page Not Found', done)
      .expect('content-type', /plain/)
  });
});
