const path = require('node:path');

const mimeTypes = {
  '.img': 'image/png',
  '.html': 'text/html',
  '.jpg': 'image/jpg',
  '.css': 'text/css',
  '.pdf': 'application/pdf',
  '.gif': 'image/gif'
};

const getMimeType = (fileName) => {
  const extension = path.extname(fileName);
  const contentType = mimeTypes[extension];
  if (!contentType || extension === '') {
    return 'text/html';
  }
  return contentType;
};

const setContentType = (request, response, next) => {
  const { pathname } = request.url;
  response.setHeader('content-type', getMimeType(pathname));
  next();
};

module.exports = { setContentType };
