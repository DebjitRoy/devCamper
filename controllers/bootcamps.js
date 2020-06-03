// @desc     Get all Bootcamps
// @route    GET /api/v1/bootcamps
// @access   public
module.exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "show all bootcamps" });
};

// @desc     Get single Bootcamps
// @route    GET /api/v1/bootcamps/:id
// @access   public
module.exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Get bootcamp #${req.params.id}` });
};

// @desc     Create new Bootcamps
// @route    POST /api/v1/bootcamps
// @access   private
module.exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "create new bootcamp" });
};

// @desc     Update single Bootcamps
// @route    PUT /api/v1/bootcamps/:id
// @access   private
module.exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp #${req.params.id}` });
};

// @desc     Delete single Bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   private
module.exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp #${req.params.id}` });
};
