const mongoose = require('mongoose');
const config = require('../config');
const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');

mongoose.connect(config.db.uri, config.db.options, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
});

module.exports = {
  User,
  Post,
  Comment,
};
