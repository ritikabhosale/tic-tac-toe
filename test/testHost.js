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

describe('GET /host', () => {
  const serverConfig = { root: '/public', usersData: './data/users.json' };
  let cookie;
  const users = { rishabh: { username: 'rishabh', password: 'ris' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync('./data/users.json', 'utf8', JSON.stringify(users)),
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
  })
  it('should redirect to game', (done) => {
    const res = request(app);

    res.get('/host')
      .set('cookie', cookie)
      .expect('location', '/game/0')
      .expect(302, done)
  });

  it('should redirect to login', (done) => {
    const serverConfig = { root: '/public' };

    const res = request(createApp(serverConfig, {}, {}));
    res.get('/host')
      .expect('location', '/login')
      .expect(302, done)
  });

});
