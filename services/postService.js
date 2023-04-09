const Post = require('../models/post.model');
const TagsUtil = require('../utils/tags');

class PostService {
  async getAllPosts() {
    return await Post.find().populate('user', 'username');
  }

  async getPostByTitle(title) {
    return await Post.findOne({ title }).populate('user', 'username');
  }

  async searchPostsByQuery(query) {
    const { title, tags, user, startDate, endDate } = query;
    const conditions = {};

    if (title) {
      conditions.title = { $regex: new RegExp(title), $options: 'i' };
    }
    if (tags) {
      const tagList = TagsUtil.splitTags(tags);
      conditions.tags = { $in: tagList };
    }
    if (user) {
      conditions.user = user;
    }
    if (startDate || endDate) {
      const dateRange = {};
      if (startDate) {
        dateRange.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRange.$lt = new Date(endDate);
      }
      conditions.createdAt = dateRange;
    }

    return await Post.find(conditions).populate('user', 'username');
  }

  async createPost({ title, description, tags, image, user }) {
    const post = new Post({ title, description, tags, image, user });
    await post.save();
    return post;
  }

  async updatePostById(postId, { title, description, tags, image }) {
    const post = await Post.findByIdAndUpdate(postId, { title, description, tags, image }, { new: true });
    return post;
  }

  async deletePostById(postId) {
    return await Post.findByIdAndDelete(postId);
  }
}

module.exports = PostService;
