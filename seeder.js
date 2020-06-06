const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({ path: "./config/config.env" });

// load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//READ JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("Data Imported...".cyan.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//> node seeder -i
//> node seeder -d
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
