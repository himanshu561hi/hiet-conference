const crypto = require('crypto');

const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
  res.setHeader('X-Request-Id', req.id);
  next();
};

module.exports = requestId;
