const parseCookies = cookiesAsString => {
  const cookies = {};
  if (cookiesAsString) {
    cookiesAsString.split(';').forEach(cookieAsString => {
      const [name, value] = cookieAsString.split('=');
      cookies[name] = value;
    });
  }
  return cookies;
};

const injectCookies = (request, response, next) => {
  const cookiesAsString = request.headers.cookie;
  const cookies = parseCookies(cookiesAsString);
  request.cookies = cookies;
  next();
};

const createSession = email => {
  const time = new Date();
  return { sessionId: time.getTime(), time, email };
};

const injectSession = sessions => (request, response, next) => {
  const { sessionId } = request.cookies;
  if (sessionId) {
    request.session = sessions[sessionId];
  }
  next();
  return;
};

const login = sessions => (request, response) => {
  const session = createSession(request.bodyParams.email);
  response.setHeader('set-cookie', 'sessionId=' + session.sessionId);
  sessions[session.sessionId] = session;
  response.setHeader('location', '/play-game');
  response.statusCode = 302;
  response.end();
  return;
};

const serveLoginForm = (formTemplate, fs) => (request, response) => {
  const form = fs.readFileSync(formTemplate, 'utf8');
  response.end(form);
};


module.exports = { login, injectCookies, injectSession, serveLoginForm };
