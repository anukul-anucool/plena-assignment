const Post = require('../models/post.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Create a new post
exports.createPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, tags } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Create a new post
    const post = new Post({
      title,
      description,
      tags: tags || [],
      createdBy: req.user.id,
    });

    // Save the post to the database
    await post.save();

    return res.status(201).json({ msg: 'Post created successfully', post });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('createdBy', 'username -_id')
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

// Get a specific post by title
exports.getPostByTitle = async (req, res) => {
  const title = req.params.title;

  try {
    const post = await Post.findOne({ title })
      .populate('createdBy', 'username -_id');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    return res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

// Search for posts by title, tags, user, and/or date range
exports.searchPosts = async (req, res) => {
  const { title, tags, username, startDate, endDate } = req.query;

  try {
    const query = {};

    if (title) {
      query.title = { $regex: new RegExp(title), $options: 'i' };
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (username) {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      query.createdBy = user._id;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    const posts = await Post.find(query)
      .populate('createdBy', 'username -_id')
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Internal Server Error');
  }
};

// Update a post by ID
