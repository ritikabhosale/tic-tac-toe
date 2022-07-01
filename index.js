const { startServer } = require('server');
const { router } = require('./src/app/app.js');

startServer(4444, router);
