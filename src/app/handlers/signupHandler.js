const serveSignupForm = (path, fs) => (request, response) => {
  if (request.session) {
    response.redirect('/');
    return;
  }
  const template = fs.readFileSync(path, 'utf8');
  response.type('html');
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
    response.redirect('/');
    return;
  }

  const user = request.bodyParams;
  if (fieldsAbsent(request.bodyParams)) {
    const status = { success: false, message: 'All fields required' };
    response.status(400);
    response.json(status);
    return;
  }

  if (userExists(users, user)) {
    const status = { success: false, message: 'User already exists' };
    response.status(409);
    response.json(status);
    return;
  }

  users[user.username] = user;
  fs.writeFileSync(path, JSON.stringify(users), 'utf8');
  const status = { success: true, message: 'Signup Successfull' };
  response.json(status);
  return;
};

module.exports = { serveSignupForm, signup }
