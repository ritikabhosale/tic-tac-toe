const { startServer } = require('server');
const { router } = require('./src/app.js');

startServer(4444, router);
