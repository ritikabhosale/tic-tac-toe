const notFound = (request, response, next) => {
  response.status(404);
  response.type('text/plain');
  response.end('Page Not Found');
  return;
};

module.exports = { notFound };
