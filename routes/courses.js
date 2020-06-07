const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");
const advResults = require("../middleware/advancedResults");

// passed mergeParams to include params coming to bootcamps route
const router = express.Router({ mergeParams: true });
// /api/v1/courses
// /api/v1/bootcamps/abc123/courses - this is handled here as redirected from bootcamps route
router
  .route("/")
  .get(
    advResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(createCourse);

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
