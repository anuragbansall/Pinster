const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
