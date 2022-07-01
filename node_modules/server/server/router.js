const router = routes => (request, response, next) => {
  let { pathname } = request.url;
  const handler = routes[pathname];
  if (!handler) {
    next();
    return;
  }

  const methodHandler = handler[request.method];
  if (!methodHandler) {
    response.statusCode = 405;
    response.setHeader('content-type', 'text/html');
    response.end('Bad method');
    return;
  }
  return methodHandler(request, response, next);
};

module.exports = { router };
