'use strict';
const swaggerSecurity = require('./api/helpers/swagger_security.js');
let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
let express = require('express');
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const User = require('./api/models/user');
const Video = require('./api/models/video');
const router = express.Router();
module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: swaggerSecurity.swaggerSecurityHandlers
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  let port = process.env.PORT || 10010;
  app.listen(port);

});
