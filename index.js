const { startServer } = require('server');
const { app } = require('./src/app.js');

startServer(4444, app('./public'));
