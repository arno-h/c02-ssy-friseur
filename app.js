const express = require('express');
const logger = require('morgan');

// Generic application setup
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Load routes into variables
const index = require('./routes/index');
const friseur = require('./routes/friseur').router;
const wartezimmer = require('./routes/wartezimmer');

// Routes
app.use('/', index);
app.use('/friseur', friseur);
app.use('/wartezimmer', wartezimmer);

module.exports = app;
