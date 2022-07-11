const createXHR = ({ method, url, body }, onload) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = (event) => onload(xhr, event);
  xhr.send(body);
};

const generateHtml = (template) => {
  const [tag, children] = template;
  const [tagName, className] = tag.split('.');
  const tagElement = document.createElement(tagName);

  if (className) {
    tagElement.className = className;
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

const convertToTemplate = (gameData) => {
  return ['div.board',
    gameData.map((row) =>
      ['div.row', row.map(e => ['div.cell', e])])
  ];
};

const generateBoard = (xhr) => {
  const game = JSON.parse(xhr.response);
  const template = convertToTemplate(game.board);
  const boardHtml = generateHtml(template);
  const idElement = generateHtml(['div.gameId', game.gameId]);
  const messageElement = generateHtml(['div.message', game.message]);
  const boardWrapper = document.querySelector('div.page-wrapper');
  boardWrapper.appendChild(idElement);
  boardWrapper.appendChild(boardHtml);
  boardWrapper.appendChild(messageElement);
};

const main = () => {
  const request = { url: '/api/game', method: 'GET' };
  createXHR(request, generateBoard);
};

window.onload = main;
