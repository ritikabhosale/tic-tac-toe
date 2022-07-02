const fs = require('fs');
const { GuestBook } = require('../guestBook');

const readComments = fileName => {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

const write = (fileName, content) => {
  fs.writeFileSync(fileName, content, 'utf8');
};

const loadGuestBook = (guestBookName) => {
  const comments = readComments(guestBookName);
  const guestBook = new GuestBook(comments);
  return (request, response, next) => {
    request.guestBook = guestBook;
    request.saveGuestBook = (guestBook) => {
      write(guestBookName, guestBook.toString());
    }
    next();
  };
};

module.exports = { loadGuestBook };
