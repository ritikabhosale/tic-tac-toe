const { Router } = require('server/server/router.js');
const { notFound } = require('./app/handlers/notFound.js');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { setContentType } = require('./app/handlers/setContentType.js');
const { parseBodyParams } = require('./app/handlers/parseBodyParams.js');
const { serveLoginForm, login } = require('./app/handlers/loginHandler.js');
const { serveSignupForm, singup } = require('./app/handlers/signupHandler.js');
const { parseSearchParams } = require('./app/handlers/parseSearchParams.js');
const { playGame } = require('./app/handlers/play.js');
const { hostHandler } = require('./app/handlers/hostHandler.js');
const { serveJoinForm, joinHandler } = require('./app/handlers/joinHandler.js');
const { gameHandler, registerMove } = require('./app/handlers/gameHandler.js');
const { serveGameAPI } = require('./app/handlers/apiHandler.js');
const { injectCookies } = require('./app/handlers/injectCookies.js');
const { injectSession } = require('./app/handlers/injectSession.js');

const optionsTemplate = './src/app/template/options.html';
const loginFormTemplate = './src/app/template/login.html';
const signupFormTemplate = './src/app/template/signup.html';
const joinTemplate = './src/app/template/join.html';
const boardTemplate = './src/app/template/board.html';

const getUsers = (filePath, fs) => {
  try {
    const rawUsers = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawUsers);
  } catch (error) {
    return {};
  }
};

const createApp = (serverConfig, sessions, games, logger, fs) => {
  const users = getUsers(serverConfig.usersData, fs);
  const router = new Router();
  const app = router.createRouter();
  router.middleware(parseBodyParams);
  router.middleware(parseSearchParams);
  router.middleware(injectCookies);
  router.middleware(injectSession(sessions));
  router.middleware(setContentType);
  router.middleware(logRequest(logger));
  router.get('/login', serveLoginForm(loginFormTemplate, fs));
  router.post('/login', login(sessions, users));
  router.get('/sign-up', serveSignupForm(signupFormTemplate, fs));
  router.post('/sign-up', singup(serverConfig.usersData, users, fs));
  router.get('/play-game', playGame(optionsTemplate, fs));
  router.get('/host', hostHandler(games));
  router.get('/join', serveJoinForm(joinTemplate, fs));
  router.post('/join', joinHandler(games));
  router.get('/api/game', serveGameAPI(games));
  router.get('/game', gameHandler(boardTemplate, fs));
  router.post('/register-move', registerMove(games));
  router.get('/', serveFileContent(serverConfig.root, fs));
  router.middleware(notFound);
  return app;
};

module.exports = { createApp };
