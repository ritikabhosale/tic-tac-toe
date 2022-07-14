const logout = sessions => (request, response) => {
  if (!request.session) {
    response.setHeader('location', '/');
    response.statusCode = 302;
    response.end();
    return;
  }
  const { sessionId } = request.session;
  delete sessions[sessionId];
  response.setHeader('location', '/');
  response.setHeader('set-cookie', 'sessionId=0;max-age:0');
  response.statusCode = 302;
  response.end();
  return;
};

module.exports = { logout };