const express = require('express');
const logger = require('morgan');

// Generic application setup
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Load routes into variables
const index = require('./services/index');
const friseur = require('./services/friseur/router').router;
const wartezimmer = require('./services/wartezimmer/router');

// Routes
app.use('/', index);
app.use('/friseur', friseur);
app.use('/wartezimmer', wartezimmer);

module.exports = app;
