const { createRouter } = require('server');
const { notFound } = require('./app/handlers/notFound');
const { serveFileContent } = require('./app/handlers/staticContent.js');

const app = (serveFrom) => {
  const handlers = [serveFileContent(serveFrom), notFound];
  return createRouter(handlers);
};

module.exports = { router: app('./public') };
