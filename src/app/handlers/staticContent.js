const path = require('node:path');

const serveFileContent = (serveFrom, fs) => (request, response, next) => {
  let pathname = request.url;
  pathname = pathname === '/' ? '/index.html' : pathname;
  const fileName = path.join(serveFrom, pathname);

  fs.readFile(fileName, (err, content) => {
    if (err) {
      next();
      return;
    }
    response.end(content);
  });
};

module.exports = { serveFileContent };
