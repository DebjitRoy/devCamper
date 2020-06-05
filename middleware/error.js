const errorHandler = (err, req, res, next) => {
  console.log(`ERROR: ${err.stack.red}`);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};

module.exports = errorHandler;
