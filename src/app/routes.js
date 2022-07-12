const { hostHandler } = require('./handlers/hostHandler.js');
const { serveLoginForm, login } = require('./handlers/loginHandler.js');
const { playGame } = require('./handlers/play.js');
const { gameHandler, registerMove } = require('./handlers/gameHandler.js');
const { serveGameAPI } = require('./handlers/apiHandler.js');
const { joinHandler, serveJoinForm } = require('./handlers/joinHandler.js');
const loginFormTemplate = './src/app/template/login.html';
const joinTemplate = './src/app/template/join.html';
const optionsTemplate = './src/app/template/options.html';

const sessions = {};
const games = {};

const routes = {
  '/play-game': { GET: playGame(optionsTemplate) },
  '/login': {
    GET: serveLoginForm(loginFormTemplate),
    POST: login(sessions)
  },
  '/host': { GET: hostHandler(games) },
  '/join': { GET: serveJoinForm(joinTemplate), POST: joinHandler(games) },
  '/game': { GET: gameHandler },
  '/api/game': { GET: serveGameAPI(games) },
  '/register-move': { POST: registerMove(games) }
};

module.exports = { routes, sessions };
