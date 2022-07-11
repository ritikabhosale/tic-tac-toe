const getGamePage = (fs = require('fs')) => {
  return fs.readFileSync('./src/app/template/board.html', 'utf8');
};

const gameHandler = (request, response) => {
  const gamePage = getGamePage();
  response.end(gamePage);
};

module.exports = { gameHandler };
