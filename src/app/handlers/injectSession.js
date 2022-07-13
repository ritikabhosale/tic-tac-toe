const injectSession = sessions => (request, response, next) => {
  const { sessionId } = request.cookies;
  if (sessionId) {
    request.session = sessions[sessionId];
  }
  next();
  return;
};

module.exports = { injectSession };
