const logout = (request, response) => {
  if (!request.session.isPopulated) {
    response.redirect('/');
    return;
  }

  request.session = null;
  response.redirect('/');
  return;
};

module.exports = { logout };