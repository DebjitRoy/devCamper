const path = require("path");
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
  res.status(200).json(res.advancedResults);
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (bootcamp) {
      bootcamp.remove();
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

// @desc     Upload Photo
// @route    PUT /api/v1/bootcamps/:id/photo
// @access   private
module.exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp ID ${req.params.id} not found`, 404)
      );
    }
    if (!req.files) {
      return next(new ErrorResponse(`Please Upload a file`, 400));
    }
    const file = req.files.file;
    console.log(file);
    if (!file.mimetype.startsWith("image/")) {
      return next(new ErrorResponse(`Please Upload an image`, 400));
    }
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      //size > 150kb
      return next(
        new ErrorResponse(
          `File too large. Please upload less than ${Math.floor(
            process.env.MAX_FILE_UPLOAD / 1000
          )} KB`,
          400
        )
      );
    }
    //create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};
