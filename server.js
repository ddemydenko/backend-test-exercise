const PORT = process.env.NODE_PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const middleware = require('swagger-express-middleware');
const requestIp = require('request-ip');

const { swaggerDocument, setupSwaggerUi, swaggerErrorHandler } = require('./services/swagger');
const { authCheck, dbErrorHandler } = require('./services/middlwares');
const { appRouter } = require('./routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(requestIp.mw());
app.get('/version', require('./routes/version'));

setupSwaggerUi(app);

middleware(swaggerDocument, app, (error, middleWare) => {
  app.use(
    middleWare.metadata(),
    middleWare.CORS(),
    middleWare.parseRequest(),
    middleWare.validateRequest()
  );

  app.use(swaggerErrorHandler);
  app.use(authCheck);
  app.use('/', appRouter);
  app.use(dbErrorHandler);

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error(err.stack);
    res.status(status);
    res.send({
      status: status,
      message: err.message
    });
  });
});

app.listen(PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log('Server is running on Port', PORT);
});

module.exports = app;
