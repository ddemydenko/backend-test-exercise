const config = require('../config/config');
const CustomError = require('../errors/CustomError');
const DB_PROVIDER_NAME = 'Sequelize';

const authCheck = (req, res, next) => {
  const token = req.get('Authorization');
  if (token === config.auth.token) {
    return next();
  }
  throw new CustomError('Error validation auth token', 401);
};

//nobody shouldn't know about DB implementation, all db stuff are writing to logs
const dbErrorHandler = (err, req, res, next) => {
  if (err.name.includes(DB_PROVIDER_NAME)) {
    console.error(err);
    res.send({
      status: 500,
      message: 'Can\'t fetch records from Database'
    });
  } else {
    next(err);
  }

};

module.exports = {
  authCheck,
  dbErrorHandler
};
