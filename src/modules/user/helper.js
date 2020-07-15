const crypto = require('crypto');

const { HMAC_KEY } = process.env;

module.exports.getHmac = (message) => {
  const hmac = crypto.createHmac('sha256', HMAC_KEY);
  return hmac.update(message).digest('hex');
};

module.exports.verifyPassword = (passwordToVerify, encryptedPassword) => {
  return module.exports.getHmac(passwordToVerify) === encryptedPassword;
};
