// const { startServer } = require('server');
// const { createApp } = require('./src/app.js');

const { createApp } = require("./src/app");

const fs = require('fs');
const appConfig = {
  root: './public',
  usersData: './data/users.json'
};

// startServer(4444, createApp(appConfig, {}, {}, console.log, fs));

const app = createApp(appConfig, {}, {}, console.log, fs);
app.listen(8888, () => console.log('Listening on http://localhost:8888'));