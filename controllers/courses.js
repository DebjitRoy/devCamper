const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async"); // to handle try-catch
const Bootcamp = require("../models/Bootcamp");

// @desc     Get Courses
// @route    GET /api/v1/courses
// @route    GET /api/v1/bootcamps/:bootcampId/courses
// @access   Private

module.exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc     Get Single Course
// @route    GET /api/v1/course/:id
// @access   Private

module.exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Add Single Course
// @route    POST /api/v1/bootcamps/:bootcampId/courses
// @access   Private

module.exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with id ${req.params.bootcampId}`),
      404
    );
  }
  console.log(req.body);
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc     Update Single Course
// @route    PUT /api/v1/courses/:id
// @access   Private

module.exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`No Course with ID ${req.params.id}`, 404));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc     Delete Single Course
// @route    DELETE /api/v1/courses/:id
// @access   Private

module.exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`No Course with ID ${req.params.id}`, 404));
  }
  course = await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: course,
  });
});
