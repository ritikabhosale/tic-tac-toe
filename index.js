const { createApp } = require("./src/app");

const fs = require('fs');
const appConfig = {
  root: './public',
  usersData: './data/users.json'
};

const app = createApp(appConfig, {}, {}, console.log, fs);
app.listen(8888, () => console.log('Listening on http://localhost:8888'));