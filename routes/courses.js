const express = require("express");
const { getCourses } = require("../controllers/courses");

// passed mergeParams to include params coming to bootcamps route
const router = express.Router({ mergeParams: true });
// /api/v1/courses
// /api/v1/bootcamps/abc123/courses - this is handled here as redirected from bootcamps route
router.route("/").get(getCourses);

module.exports = router;