'use strict';
const swaggerSecurity = require('./api/helpers/swagger_security.js');
let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
const mongoose = require('mongoose');
module.exports = app; // for testing

mongoose.connect('mongodb+srv://admin:admin@netflix.vlpaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

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
