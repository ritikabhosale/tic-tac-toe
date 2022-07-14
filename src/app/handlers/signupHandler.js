const serveSignupForm = (path, fs) => (request, response) => {
  if (request.session) {
    const status = { success: true, message: 'Already logged in' }
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(status));
    return;
  }
  const template = fs.readFileSync(path, 'utf8');
  response.end(template);
  return;
};

const singup = (path, users, fs) => (request, resposne) => {
  const user = request.bodyParams;
  users[user.username] = user;
  fs.writeFileSync(path, JSON.stringify(users), 'utf8');
  const status = { sucess: true, message: 'Signup Successfull' };
  resposne.setHeader('content-type', 'application/json');
  resposne.end(JSON.stringify(status));
  return;
};

module.exports = { serveSignupForm, singup }
