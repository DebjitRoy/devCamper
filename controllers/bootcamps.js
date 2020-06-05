const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all Bootcamps
// @route    GET /api/v1/bootcamps
// @access   public
module.exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, data: bootcamps, length: bootcamps.length });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc     Get single Bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   public
module.exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (bootcamp) {
      return res.status(200).json({ success: true, data: bootcamp });
    }
    res.status(400).json({ success: false });
  } catch (err) {
    next(new ErrorResponse(`Bootcamp ID ${req.params.id} not found`, 404));
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
    res.status(400).json({ success: false });
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
    res.status(400).json({ success: false });
  } catch (err) {
    res.status(400).json({ success: false });
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
    res.status(400).json({ success: false });
  } catch (err) {
    res.status(400).json({ success: false });
  }
  //   res
  //     .status(200)
  //     .json({ success: true, msg: `Delete bootcamp #${req.params.id}` });
};
