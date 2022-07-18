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

describe('GET /login', () => {
  const users = { rishabh: { username: 'rishabh', password: 'ris' } };
  const serverConfig = { root: '/public', usersData: './data/users.json' };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync([
      { file: './data/users.json', content: JSON.stringify(users) },
      { file: './src/app/template/login.html', content: 'login template' }
    ], 'utf8')
  };

  it('should serve login page', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    req.get('/login')
      .expect(200, 'login template', done)
      .expect('content-type', /html/)
  });

  let cookie;
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
  it('should redirect to home page when already logged in.', (done) => {
    const req = request(app);
    req.get('/login')
      .set('Cookie', cookie)
      .expect(302, done)
  });
});

describe('POST /login', () => {
  const serverConfig = { root: '/someDir', usersData: './data/users.json' };
  const users = { 'abc': { username: 'abc', password: '123' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync([
      { file: './data/users.json', content: JSON.stringify(users) }, { file: './data/users.json', content: JSON.stringify(users) }], 'utf8')
  };

  it('should redirect to /play-game', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    req.post('/login')
      .send('username=abc&password=123')
      .expect(302, done)
      .expect('location', '/play-game')
  });

  it('should not allow unauthenticated user', (done) => {
    const status = { success: false, message: 'Invalid username or password' };
    const req = request(createApp(serverConfig, {}, fs));
    req.post('/login')
      .send('username=abcd&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(422, status, done)
      .expect('content-type', /json/)
  });


  it('should not allow if mandatory fields are empty', (done) => {
    const status = { success: false, message: 'All fields required' };
    const req = request(createApp(serverConfig, {}, fs));
    req.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(400, status, done)
      .expect('content-type', /json/)
  });

  const app = createApp(serverConfig, {}, fs);
  before((done) => {
    const loginRequest = request(app);
    loginRequest.post('/login')
      .send('username=abc&password=123')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      });
  })

  it('should redirect to /login if already logged in', (done) => {
    const req = request(app);
    req.post('/login')
      .set('Cookie', cookie)
      .expect(302, done)
  });
});
