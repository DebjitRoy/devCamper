const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); // Logger MW
const colors = require("colors");
const fileupload = require("express-fileupload");
const path = require("path");

const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

//adds content to process.env
dotenv.config({ path: "./config/config.env" });

//Connect to db
connectDB();

// Middleware files
// Custom Logger
// const logger = require("./middleware/logger");

// Route files
const bootcampRoute = require("./routes/bootcamps");
const courseRoute = require("./routes/courses");
const authRoute = require("./routes/auth");

const PORT = process.env.PORT || 5000;
const app = express();

// Body Parser
app.use(express.json()); // adds json-parser

// Use Custom Middleware
// app.use(logger);

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Set Static folder for image to be accessed from browswer
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcampRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/auth", authRoute);

app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold
  )
);

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});
