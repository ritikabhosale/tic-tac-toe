const http = require('http');

const startServer = (PORT, router) => {
  const server = http.createServer(router);

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${server.address().port}`);
  });
};

module.exports = { startServer };
