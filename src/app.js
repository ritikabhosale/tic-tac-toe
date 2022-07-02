const { createRouter, router } = require('server');
const { notFound } = require('./app/handlers/notFound');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { loadGame } = require('./app/handlers/play.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { routes } = require('./app/routes.js');
const { setContentType } = require('./app/handlers/setContentType');

const app = (serveFrom, noOfPlayers) => {
  const handlers = [setContentType, loadGame(noOfPlayers), setContentType, logRequest, serveFileContent(serveFrom), router(routes), notFound];
  return createRouter(handlers);
};

module.exports = { router: app('./public', 2) };
