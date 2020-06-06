const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../utils/geocoder");

// @desc     Get all Bootcamps
// @route    GET /api/v1/bootcamps
// @access   public
// Following is preffered way of handling try catch in middleware.
// But for clarity, using regurar try catch for all other APIs
module.exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query);
  // replaces gt with $gt, gte with $gte etc
  // $gt, $lt etc are used by mongoose for Number data
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // query str to get all bootcamps with averageCost <=10000
  // /api/v1/bootcamps?averageCost[lte]=10000

  // Find By State:
  // /api/v1/bootcamps?location.state=CA
  //   console.log(queryStr);

  const bootcamps = await Bootcamp.find(JSON.parse(queryStr));
  res
    .status(200)
    .json({ success: true, data: bootcamps, count: bootcamps.length });
});
// ====== same in try catch=======
// module.exports.getBootcamps = async (req, res, next) => {
//   try {
//     const bootcamps = await Bootcamp.find();
//     res
//       .status(200)
//       .json({ success: true, data: bootcamps, count: bootcamps.length });
//   } catch (err) {
//     // res.status(400).json({ success: false });
//     next(err);
//   }
// };
// =================================

// @desc     Get single Bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   public
module.exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (bootcamp) {
      return res.status(200).json({ success: true, data: bootcamp });
    }
    return next(
      new ErrorResponse(`Bootcamp ID ${req.params.id} not found`, 404)
    );
  } catch (err) {
    next(err);
  }
};

// @desc     Create new Bootcamps
// @route    POST /api/v1/bootcamps
// @access   private
module.exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc     Update single Bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   private
module.exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (bootcamp) {
      return res.status(201).json({ success: true, data: bootcamp });
    }
    return next(
      new ErrorResponse(`Bootcamp ID ${req.params.id} not found`, 404)
    );
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc     Delete single Bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   private
module.exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if (bootcamp) {
      return res.status(201).json({ success: true, data: bootcamp });
    }
    return next(
      new ErrorResponse(`Bootcamp ID ${req.params.id} not found`, 404)
    );
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc     Get Bootcamp within a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   private
module.exports.getBootcampsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/Long from GeoCoder
  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth radius = 3963 miles / 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
};
