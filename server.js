const express = require("express");
const dotenv = require("dotenv");

// Route files
const bootcampRoute = require("./routes/bootcamps");

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;
const app = express();

// Mount routers
app.use("/api/v1/bootcamps", bootcampRoute);

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`)
);
