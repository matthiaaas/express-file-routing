const express = require('express');
const app = express();
const { router } = require('../../lib/cjs');

    app.use( express.json() )
    app.use('/api', router({ directory: 'api'}) ) // "routes" is default directory but custom "api"

 module.exports = app;