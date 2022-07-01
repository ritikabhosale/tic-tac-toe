const { createRouter } = require('server');
const { notFound } = require('./handlers/notFound.js');
const { serveFileContent } = require('./handlers/staticContent.js');

const app = (serveFrom) => {
  const handlers = [serveFileContent(serveFrom), notFound];
  return createRouter(handlers);
};

module.exports = { router: app('./public') };
