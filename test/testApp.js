const { app } = require('../src/app.js');
const request = require('supertest');

describe('app', () => {
  it('should route to not found on /abc ', (done) => {
    const req = request(app('./someDir'));
    req.get('/abc')
      .expect(404, 'Page Not Found', done)
      .expect('content-type', /plain/)
  });
  it('should send static content', (done) => {
    const req = request(app('./public'));
    req.get('/index.html')
      .expect(200, done)
      .expect('content-type', /html/)
      .expect('content-length', "557")
  });
});
