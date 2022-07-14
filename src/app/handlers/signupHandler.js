const serveSignupForm = (path, fs) => (request, response) => {
  if (request.session) {
    response.setHeader('location', '/');
    response.statusCode = 302;
    response.end();
    return;
  }
  const template = fs.readFileSync(path, 'utf8');
  response.end(template);
  return;
};

const fieldsAbsent = ({ username, password }) => {
  return !username || !password;
};

const userExists = (users, { username }) => {
  return users[username] ? true : false;
}

const signup = (path, users, fs) => (request, response) => {
  if (request.session) {
    response.setHeader('location', '/');
    response.statusCode = 302;
    response.end();
    return;
  }

  const user = request.bodyParams;
  if (fieldsAbsent(request.bodyParams)) {
    response.statusCode = 400;
    response.setHeader('content-type', 'application/json');
    const status = { success: false, message: 'All fields required' };
    response.end(JSON.stringify(status));
    return;
  }

  if (userExists(users, user)) {
    const status = { success: false, message: 'User already exists' };
    response.setHeader('content-type', 'application/json');
    response.statusCode = 409;
    response.end(JSON.stringify(status));
    return;
  }

  users[user.username] = user;
  fs.writeFileSync(path, JSON.stringify(users), 'utf8');
  const status = { success: true, message: 'Signup Successfull' };
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(status));
  return;
};

module.exports = { serveSignupForm, signup }
