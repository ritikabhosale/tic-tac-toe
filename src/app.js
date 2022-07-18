const express = require('express');

const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const { notFound } = require('./app/handlers/notFound.js');
const { serveLoginForm, login } = require('./app/handlers/loginHandler.js');
const { serveSignupForm, signup } = require('./app/handlers/signupHandler.js');
const { playGame } = require('./app/handlers/play.js');
const { hostHandler } = require('./app/handlers/hostHandler.js');
const { serveJoinForm, joinHandler } = require('./app/handlers/joinHandler.js');
const { gameHandler, registerMove } = require('./app/handlers/gameHandler.js');
const { serveGameAPI } = require('./app/handlers/apiHandler.js');
// const { injectCookies } = require('./app/handlers/injectCookies.js');
// const { injectSession } = require('./app/handlers/injectSession.js');
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

const createApp = (appConfig, games, fs) => {
  const app = express();
  const { usersData, root } = appConfig;
  const users = getUsers(usersData, fs);
  const parseBodyParams = express.urlencoded({ extended: true });
  app.use(parseBodyParams);
  app.use(cookieParser());
  app.use(cookieSession({
    name: 'sessionId',
    keys: ['hello']
  }));

  app.use(morgan('tiny'));
  app.get('/login', serveLoginForm(loginFormTemplate, fs));
  app.post('/login', login(users));
  app.get('/logout', logout);
  app.get('/sign-up', serveSignupForm(signupFormTemplate, fs));
  app.post('/sign-up', signup(appConfig.usersData, users, fs));
  app.get('/play-game', playGame(optionsTemplate, fs));
  app.get('/host', hostHandler(games));
  app.get('/join', serveJoinForm(joinTemplate, fs));
  app.post('/join', joinHandler(games));
  app.get('/api/game/:gameId', serveGameAPI(games));
  app.get('/game/:gameId', gameHandler(boardTemplate, fs));
  app.post('/register-move', registerMove(games));
  app.use(express.static(root));
  app.use(notFound);
  return app;
};

module.exports = { createApp };
