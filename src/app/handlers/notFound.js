const notFound = (request, response, next) => {
  response.end('Not Found');
  return;
};

module.exports = { notFound };
