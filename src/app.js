const { Router } = require('server/server/router');
const { notFound } = require('./app/handlers/notFound');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { setContentType } = require('./app/handlers/setContentType');
const { parseBodyParams } = require('./app/handlers/parseBodyParams');
const { serveLoginForm, login } = require('./app/handlers/loginHandler');
const { parseSearchParams } = require('./app/handlers/parseSearchParams');
const { playGame } = require('./app/handlers/play');
const { hostHandler } = require('./app/handlers/hostHandler');
const { serveJoinForm, joinHandler } = require('./app/handlers/joinHandler');
const { gameHandler, registerMove } = require('./app/handlers/gameHandler');
const { serveGameAPI } = require('./app/handlers/apiHandler');
const { injectCookies } = require('./app/handlers/injectCookies');
const { injectSession } = require('./app/handlers/injectSession');
const optionsTemplate = './src/app/template/options.html';
const loginFormTemplate = './src/app/template/login.html';
const joinTemplate = './src/app/template/join.html';
const boardTemplate = './src/app/template/board.html';

const createApp = (serverConfig, sessions, games, logger, fs) => {
  const router = new Router();
  const app = router.createRouter();
  router.middleware(parseBodyParams);
  router.middleware(parseSearchParams);
  router.middleware(injectCookies);
  router.middleware(injectSession(sessions));
  router.middleware(setContentType);
  router.middleware(logRequest(logger));
  router.get('/login', serveLoginForm(loginFormTemplate, fs));
  router.post('/login', login(sessions));
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
