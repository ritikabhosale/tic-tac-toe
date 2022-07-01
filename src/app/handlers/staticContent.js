const fs = require('fs');
const path = require('node:path');

const serveFileContent = serveFrom => (request, response, next) => {
  let { pathname } = request.url;
  pathname = pathname === '/' ? '/index.html' : pathname;
  console.log(pathname);
  const fileName = path.join(serveFrom, pathname);

  if (fs.existsSync(fileName)) {
    fs.readFile(fileName, (err, content) => {
      response.end(content);
    });
  } else {
    next();
  }
};

module.exports = { serveFileContent };
