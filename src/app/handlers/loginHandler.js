const createSession = username => {
  const time = new Date();
  return { time, username };
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

const login = (users) => (request, response) => {
  if (request.session.isPopulated) {
    response.redirect('/');
    return;
  }

  if (fieldsAbsent(request.body)) {
    const status = { success: false, message: 'All fields required' };
    response.status(400);
    response.json(status);
    return;
  }

  if (!authenticateUser(users, request.body)) {
    const status = { success: false, message: 'Invalid username or password' };
    response.status(422);
    response.json(status);
    return;
  }

  request.session = createSession(request.body.username);
  response.redirect('/play-game')
  return;
};

const serveLoginForm = (formTemplate, fs) => (request, response) => {
  if (request.session.isPopulated) {
    response.redirect('/');
    return;
  }
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.type('html')
  response.end(form);
};


module.exports = { login, serveLoginForm };
