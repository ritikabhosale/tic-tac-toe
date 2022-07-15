const express = require('express');

const { Router } = require('server/server/router.js');
const { notFound } = require('./app/handlers/notFound.js');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { setContentType } = require('./app/handlers/setContentType.js');
const { parseBodyParams } = require('./app/handlers/parseBodyParams.js');
const { serveLoginForm, login } = require('./app/handlers/loginHandler.js');
const { serveSignupForm, signup } = require('./app/handlers/signupHandler.js');
const { parseSearchParams } = require('./app/handlers/parseSearchParams.js');
const { playGame } = require('./app/handlers/play.js');
const { hostHandler } = require('./app/handlers/hostHandler.js');
const { serveJoinForm, joinHandler } = require('./app/handlers/joinHandler.js');
const { gameHandler, registerMove } = require('./app/handlers/gameHandler.js');
const { serveGameAPI } = require('./app/handlers/apiHandler.js');
const { injectCookies } = require('./app/handlers/injectCookies.js');
const { injectSession } = require('./app/handlers/injectSession.js');
const { logout } = require('./app/handlers/logout.js');

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

const createApp = (appConfig, sessions, games, logger, fs) => {
  const app = express();
  const { usersData, root } = appConfig;
  const users = getUsers(usersData, fs);
  // const router = new Router();
  // const app = router.createRouter();
  // app.use(parseSearchParams);
  // app.use(setContentType);
  const parseBodyParams = express.urlencoded({ extended: true });
  app.use(parseBodyParams);
  app.use((request, response, next) => {
    request.bodyParams = request.body;
    next();
  });
  app.use(injectCookies);
  app.use(injectSession(sessions));
  app.use(logRequest(logger));
  app.get('/login', serveLoginForm(loginFormTemplate, fs));
  app.post('/login', login(sessions, users));
  app.get('/logout', logout(sessions));
  app.get('/sign-up', serveSignupForm(signupFormTemplate, fs));
  app.post('/sign-up', signup(appConfig.usersData, users, fs));
  app.get('/play-game', playGame(optionsTemplate, fs));
  app.get('/host', hostHandler(games));
  app.get('/join', serveJoinForm(joinTemplate, fs));
  app.post('/join', joinHandler(games));
  app.get('/api/game', serveGameAPI(games));
  app.get('/game', gameHandler(boardTemplate, fs));
  app.post('/register-move', registerMove(games));
  app.use(express.static(root));
  app.use(notFound);
  return app;
};

module.exports = { createApp };
