const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  // 2nd optional are (options) to avoid console warning
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected : ${conn.connection.host}`.green.underline);
};

module.exports = connectDB;
