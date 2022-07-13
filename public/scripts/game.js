const createXHR = ({ method, url, body }, onload) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = (event) => onload(xhr, event);
  xhr.send(body);
};

const getMessage = ({ ready, result }) => {
  console.log(ready, result);
  if (!ready) {
    return 'Waiting for another player';
  }
  const { isOver, draw, winner } = result;
  if (!isOver) {
    return 'current player name';
  }
  if (winner) {
    return `${winner.playerId} has won the game.`;
  }
  if (draw) {
    return 'It\'s a draw.';
  }
  return '';
}

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

const partitionBy = (chunkedList, element, chunkSize) => {
  const lastChunk = chunkedList[chunkedList.length - 1];

  if (lastChunk.length < chunkSize) {
    lastChunk.push(element);
    return chunkedList;
  }

  chunkedList.push([element]);
  return chunkedList;
};

const convertToTemplate = (board) => {
  let id = 0;
  const cells = board.map(innerText => {
    id++;
    return [`div.cell#${id}`, innerText]
  });

  const rows = cells.reduce((chunkedList, element) => {
    return partitionBy(chunkedList, element, 3)
  }, [[]]);

  return ['div.board', rows.map((row) => ['div.row', row])];
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
};

const registerMove = (event) => {
  const { id } = event.target;
  const request = { url: '/register-move', method: 'POST', body: `id=${id}` };
  createXHR(request, () => {
    const request = { url: '/api/game', method: 'GET' };
    createXHR(request, generateBoard);
  });
};

const generateBoard = (xhr) => {
  const gameElement = document.querySelector('.game');
  cleanGame(gameElement);

  const game = JSON.parse(xhr.response);
  const template = convertToTemplate(game.board);

  drawElement(['div.gameId', game.gameId], gameElement);
  drawElement(template, gameElement);
  drawElement(['div.message', getMessage(game)], gameElement);

  const boardElement = document.querySelector('.board');
  if (game.result.isOver) {
    stopGame(boardElement);
    return;
  }
  boardElement.addEventListener('click', registerMove);
};

const main = () => {
  const request = { url: '/api/game', method: 'GET' };
  setInterval(() => {
    createXHR(request, generateBoard);
  }, 500);
};

window.onload = main;
