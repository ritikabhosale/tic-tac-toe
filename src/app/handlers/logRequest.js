const logRequest = (request, response, next) => {
  console.log(request.method, request.url.pathname);
  next();
};

module.exports = { logRequest };
