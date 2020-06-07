const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a course description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add number of cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

// Static method to get average cost for a singlt bootcamp
CourseSchema.statics.getAvgCost = async function (bootcampId) {
  // aggregate takes a pipe - execute one after other
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  console.log(obj);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.round(obj[0].averageCost),
    });
  } catch (error) {
    console.log(error);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function (next) {
  this.constructor.getAvgCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre("remove", function (next) {
  this.constructor.getAvgCost(this.bootcamp);
});
module.exports = mongoose.model("Course", CourseSchema);
