const createSession = username => {
  const time = new Date();
  return { sessionId: time.getTime(), time, username };
};

const authenticateUser = (users, userDetails) => {
  const user = users[userDetails.username];
  if (user) {
    return user.password === userDetails.password;
  }
  return false;
};

const fieldsAbsent = ({ username, password }) => {
  return !username || !password;
};

const login = (sessions, users) => (request, response) => {
  if (request.session) {
    const status = { success: true, message: 'Already logged in' };
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(status));
    return;
  }

  if (fieldsAbsent(request.bodyParams)) {
    response.statusCode = 400;
    response.setHeader('content-type', 'application/json');
    const status = { success: false, message: 'All fields required' };
    response.end(JSON.stringify(status));
    return;
  }

  if (!authenticateUser(users, request.bodyParams)) {
    response.statusCode = 422;
    response.setHeader('content-type', 'application/json');
    const status = { success: false, message: 'Invalid username or password' };
    response.end(JSON.stringify(status));
    return;
  }

  const session = createSession(request.bodyParams.username);
  response.setHeader('set-cookie', 'sessionId=' + session.sessionId);
  sessions[session.sessionId] = session;
  response.setHeader('location', '/play-game');
  response.statusCode = 302;
  response.end();
  return;
};

const serveLoginForm = (formTemplate, fs) => (request, response) => {
  if (request.session) {
    const status = { success: true, message: 'Already logged in' }
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(status));
    return;
  }
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};


module.exports = { login, serveLoginForm };
