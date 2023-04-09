const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 3000,
    },
    image: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      lowercase: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
