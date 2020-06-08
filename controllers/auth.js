const Bootcamp = require("../models/Bootcamp");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc     Register User
// @route    POST /api/v1/auth/register
// @access   public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

// @desc     Login User
// @route    POST /api/v1/auth/login
// @access   public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // Check for user
  // By default, password has been excluded from the response. we are adding password in response here
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid crentials", 401));
  }

  // getting plain text password and matching with encrypted
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid crentials", 401));
  }
  //create Token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
