const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const ymlRawPath = '/api/swagger/swagger.yaml';
const ymlPath = `${process.cwd()}${ymlRawPath}`;
const swaggerDocument = YAML.load(ymlPath);

const setupSwaggerUi = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

const swaggerErrorHandler = (err, req, res, next) => {
  res.status(err.status);
  res.send({
    status: err.status,
    message: 'Swagger Validation Error: ' + err.message.toString()
  });
};

module.exports = { swaggerDocument, setupSwaggerUi, swaggerErrorHandler };
