const notFound = (request, response, next) => {
  response.statusCode = 404;
  response.setHeader('content-type', 'text/plain');
  response.end('Page Not Found');
  return;
};

module.exports = { notFound };
