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

const mockWriteFileSync = (expectedFile, expectedContent, expectedEncoding) => {
  return (fileName, content, encoding) => {
    assert.equal(fileName, expectedFile);
    assert.equal(content, expectedContent);
    assert.equal(encoding, expectedEncoding);
  };
};

describe('GET /sign-up', () => {
  const serverConfig = { root: '/someDir', usersData: './data/users.json' };
  const users = { 'abc': { username: 'abc', password: '123' } };
  const fs = {
    readFile: () => { },
    readFileSync: mockReadFileSync([
      { file: './data/users.json', content: JSON.stringify(users) }, { file: './src/app/template/signup.html', content: 'signup template' }], 'utf8')
  };

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

  it('should serve signup page', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    req.get('/sign-up')
      .expect(200, 'signup template', done)
      .expect('content-type', /html/)
  });

  it('should redirect to home page when already logged in.', (done) => {
    const req = request(app);
    req.get('/sign-up')
      .set('Cookie', cookie)
      .expect(302, done)
  });
});

describe('POST /sign-up', () => {
  const serverConfig = { root: '/someDir', usersData: '/data/users.json' };
  const users = { 'abc': { username: 'abc', password: '123' } };
  const updatedUsers = {
    'abc': { username: 'abc', password: '123' },
    'rishabh': { username: 'rishabh', password: 'bcd' }
  };

  const fs = {
    readFile: () => { },

    readFileSync: mockReadFileSync([{ file: '/data/users.json', content: JSON.stringify(users) }, { file: '/data/users.json', content: JSON.stringify(users) }, { file: '/data/users.json', content: JSON.stringify(users) }], 'utf8'),

    writeFileSync: mockWriteFileSync(serverConfig.usersData,
      JSON.stringify(updatedUsers),
      'utf8')
  };

  it('should persist user data', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    const status = { success: true, message: 'Signup Successfull' };
    req.post('/sign-up')
      .send('username=rishabh&password=bcd')
      .expect(200, status, done)
      .expect('content-type', /json/)
  });

  it('should not allow duplicate username', (done) => {
    const req = request(createApp(serverConfig, {}, fs));
    const status = { success: false, message: 'User already exists' };
    req.post('/sign-up')
      .send('username=abc&password=bcd')
      .expect(409, status, done)
      .expect('content-type', /json/)
  });

  it('should not allow if mandatory fields are empty', (done) => {
    const status = { success: false, message: 'All fields required' };
    const req = request(createApp(serverConfig, {}, {}, fs));
    req.post('/sign-up')
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

  it('should redirect to home page when already logged in', (done) => {
    const req = request(app);
    req.post('/sign-up')
      .set('Cookie', cookie)
      .expect(302, done)
  });
});
