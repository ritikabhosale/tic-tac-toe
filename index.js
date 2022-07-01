const { router, startServer } = require('server');

const handler = (request, response) => {
  response.end('hello');
};

startServer(4444, handler);
