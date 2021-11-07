'use strict';
let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  let port = process.env.PORT || 10010;
  app.listen(port);

});
