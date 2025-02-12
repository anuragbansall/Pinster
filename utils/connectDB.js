const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURL = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
