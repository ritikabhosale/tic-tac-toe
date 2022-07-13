const logRequest = (logger) => (request, response, next) => {
  logger(request.method, request.url);
  next();
};

module.exports = { logRequest };
