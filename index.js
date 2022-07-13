const { startServer } = require('server');
const { createApp } = require('./src/app.js');

const fs = require('fs');
const serverConfig = {
  root: './public'
};

startServer(4444, createApp(serverConfig, {}, {}, console.log, fs));
