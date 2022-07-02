const { play } = require('./handlers/play.js');

const routes = {
  '/play': { POST: play },
};

module.exports = { routes };
