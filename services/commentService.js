const Comment = require('../models/comment.model');

class CommentService {
  async getAllComments() {
    return await Comment.find().populate('user', 'username');
  }

  async getCommentsByPostId(postId) {
    return await Comment.find({ post: postId }).populate('user', 'username');
  }

  async createComment({ text, user, post }) {
    const comment = new Comment({ text, user, post });
    await comment.save();
    return comment;
  }

  async deleteCommentById(commentId) {
    return await Comment.findByIdAndDelete(commentId);
  }
}

module.exports = CommentService;
