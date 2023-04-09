const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(err.stack);

  // Set the response status code
  res.status(err.statusCode || 500);

  // Send the error message
  res.json({
    error: {
      message: err.message
    }
  });
};

module.exports = errorHandler;
