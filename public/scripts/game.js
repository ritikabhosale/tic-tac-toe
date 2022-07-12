const createXHR = ({ method, url, body }, onload) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = (event) => onload(xhr, event);
  xhr.send(body);
};

const splitTag = (tag) => {
  const [tagName, attributes] = tag.split('.');
  const [className, id] = attributes.split('#');
  return { tagName, className, id };
}

const generateHtml = (template) => {
  const [tag, children] = template;
  const { tagName, className, id } = splitTag(tag);
  const tagElement = document.createElement(tagName);

  if (className) {
    tagElement.className = className;
  }
  if (id) {
    tagElement.id = id;
  }
  if (!Array.isArray(children)) {
    tagElement.innerText = children;
    return tagElement;
  }
  children.forEach(child => {
    tagElement.appendChild(generateHtml(child));
  });
  return tagElement;
};

const convertToTemplate = (board) => {
  let id = 0;
  return ['div.board',
    board.map((row) =>
      ['div.row', row.map((innerText) => {
        id++;
        return [`div.cell#${id}`, innerText];
      })])
  ];
};

const drawElement = (template, parentElement) => {
  const element = generateHtml(template);
  parentElement.appendChild(element);
};

const cleanGame = (gameElement) => {
  while (gameElement.firstChild) {
    gameElement.removeChild(gameElement.firstChild);
  }
};

const stopGame = boardElement => {
  boardElement.removeEventListener('click', registerMove);
}

const generateBoard = (xhr) => {
  const gameElement = document.querySelector('.game');
  cleanGame(gameElement);

  const game = JSON.parse(xhr.response);
  const template = convertToTemplate(game.board);

  drawElement(['div.gameId', game.gameId], gameElement);
  drawElement(template, gameElement);
  drawElement(['div.message', game.message], gameElement);

  const boardElement = document.querySelector('.board');
  if (game.isOver) {
    stopGame(boardElement);
    return;
  }
  boardElement.addEventListener('click', registerMove);
};

const registerMove = (event) => {
  const { id } = event.target;
  const request = { url: '/register-move', method: 'POST', body: `id=${id}` };
  createXHR(request, () => {
    const request = { url: '/api/game', method: 'GET' };
    createXHR(request, generateBoard);
  });
};

const main = () => {
  const request = { url: '/api/game', method: 'GET' };
  createXHR(request, generateBoard);
};

window.onload = main;
