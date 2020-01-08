const VERSION = require('../package.json').version;

const version = (req, res) => {
  res.json({
    status: 200,
    version: VERSION
  });
};
module.exports = version;
