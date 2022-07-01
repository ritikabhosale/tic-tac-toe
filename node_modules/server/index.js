const { router } = require('./server/router.js');
const { createRouter } = require('./server/runHandlers.js');
const { startServer } = require('./server/server.js');

module.exports = { router, createRouter, startServer };
