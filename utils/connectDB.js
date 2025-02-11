const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURL =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pinster";
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
