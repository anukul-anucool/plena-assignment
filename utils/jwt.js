const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
