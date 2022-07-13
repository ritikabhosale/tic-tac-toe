const { createRouter, router } = require('server');
const { notFound } = require('./app/handlers/notFound');
const { serveFileContent } = require('./app/handlers/staticContent.js');
const { logRequest } = require('./app/handlers/logRequest.js');
const { routes, sessions } = require('./app/routes.js');
const { setContentType } = require('./app/handlers/setContentType');
const { parseBodyParams } = require('./app/handlers/parseBodyParams');
const { injectCookies, injectSession } = require('./app/handlers/loginHandler');

const app = (serveFrom) => {
  const handlers = [
    parseBodyParams,
    injectCookies,
    injectSession(sessions),
    setContentType,
    logRequest,
    serveFileContent(serveFrom),
    router(routes),
    notFound
  ];
  return createRouter(handlers);
};

module.exports = { app };
