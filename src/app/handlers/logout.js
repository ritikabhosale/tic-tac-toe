const logout = sessions => (request, response) => {
  if (!request.session) {
    response.redirect('/');
    return;
  }
  const { sessionId } = request.session;
  delete sessions[sessionId];

  response.clearCookie('sessionId');
  response.redirect('/');
  return;
};

module.exports = { logout };