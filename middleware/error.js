const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err);
  console.log(`${err.name}: ${err.stack.red}`);

  // Bad Object Error
  if (err.name === "CastError") {
    const message = `Bootcamp ID ${err.value} not found`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose Duplicate key Error
  if (err.code === 11000) {
    const message = `Duplicate field entered`;
    error = new ErrorResponse(message, 400);
  }
  // Validation Error
  if (err.name === "ValidationError") {
    const errors = [];
    // err.errors.forEach((er) => errors.push(err.errors[er].ValidatorError));

    for (let er in err.errors) {
      errors.push(err.errors[er].properties.message);
    }
    const message = `Validation Error: ${errors.join(" ,")}`;
    error = new ErrorResponse(message, 400);
  }
  // Default
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
