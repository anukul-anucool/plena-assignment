const notFoundHandler = (req, res, next) => {
    // Set the response status code
    res.status(404);
  
    // Send the error message
    res.json({
      error: {
        message: 'Not Found'
      }
    });
  };
  
  module.exports = notFoundHandler;
  