const mongoose = require("mongoose");
const connectDB = require("../utils/connectDB");
const plm = require("passport-local-mongoose");

connectDB();

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "User",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
    default:
      "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
  },
  contactNumber: {
    type: String,
  },
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

UserSchema.plugin(plm);

const User = mongoose.model("User", UserSchema);
module.exports = User;
