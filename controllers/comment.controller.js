const Comment = require('../models/comment.model');

// Create a new comment for a post
exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const { username } = req.user;

    const newComment = new Comment({
      post: postId,
      text,
      author: username
    });

    await newComment.save();

    // Update comment counter for the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    res.status(201).json({ message: 'Comment created successfully.' });
  } catch (err) {
    next(err);
  }
};

// Delete a comment for a post
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.author !== req.user.username) {
      return res.status(401).json({ message: 'You are not authorized to delete this comment.' });
    }

    await comment.remove();

    // Update comment counter for the post
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });

    res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
