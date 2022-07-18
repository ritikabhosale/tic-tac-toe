const playGame = (optionsTemplate, fs) => (request, response) => {
  if (!request.session.isPopulated) {
    response.redirect('/login');
    return;
  }
  const body = fs.readFileSync(optionsTemplate, 'utf-8');
  response.type('html');
  response.end(body);
  return;
};

module.exports = { playGame };
