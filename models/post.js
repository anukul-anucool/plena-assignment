// Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
  description: { type: String, required: true, minlength: 10, maxlength: 3000 },
  image: { type: String, required: true },
  tags: [{ type: String, lowercase: true }],
  tagCount: { type: Map, of: Number },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  commentCount: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

postSchema.index({ title: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
