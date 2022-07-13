const playGame = (optionsTemplate, fs) => (request, response) => {
  if (!request.session) {
    response.statusCode = 302;
    response.setHeader('location', '/login');
    response.end();
    return;
  }
  const body = fs.readFileSync(optionsTemplate, 'utf-8');
  response.end(body);
  return;
};

module.exports = { playGame };
