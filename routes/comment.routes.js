const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { validateComment } = require('../handlers/validationHandler');

// Routes for comments
router.get('/', commentController.getComments);
router.post(
  '/',
  authMiddleware,
  uploadMiddleware,
  validateComment,
  commentController.createComment
);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
