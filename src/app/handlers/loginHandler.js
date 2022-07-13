const createSession = email => {
  const time = new Date();
  return { sessionId: time.getTime(), time, email };
};

const login = sessions => (request, response) => {
  if (request.session) {
    response.setHeader('content-type', 'text/plain');
    response.end('You are already logged in.');
    return;
  }
  const session = createSession(request.bodyParams.email);
  response.setHeader('set-cookie', 'sessionId=' + session.sessionId);
  sessions[session.sessionId] = session;
  response.setHeader('location', '/play-game');
  response.statusCode = 302;
  response.end();
  return;
};

const serveLoginForm = (formTemplate, fs) => (request, response) => {
  if (request.session) {
    response.setHeader('content-type', 'text/plain');
    response.end('You are already logged in.');
    return;
  }
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};


module.exports = { login, serveLoginForm };
