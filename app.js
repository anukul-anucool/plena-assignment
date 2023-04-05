const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

mongoose.connect('mongodb://localhost:27017/posting', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error(err));

  const postSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
    description: { type: String, required: true, minlength: 10, maxlength: 3000 },
    tags: [{ type: String, lowercase: true }],
    image: { type: String, required: true },
    author: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    commentCount: { type: Number, default: 0 },
    // commentsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  });

const Post = mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, minlength: 2, maxlength: 200 },
  commentsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdDate: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

app.use(express.json());

const secretKey = 'mySecretKey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = { username };
  const accessToken = jwt.sign(user, secretKey);

  const hashedPassword = await bcrypt.hash(password, 10);

  // save the user and hashed password to the database

  res.json({ accessToken });
});

app.get('/posts', async (req, res) => {
  const { tag, user, startDate, endDate } = req.query;
  const query = {};
  if (tag) query.tags = tag.toLowerCase();
  if (user) query.author = user;
  if (startDate && endDate) {
    query.createdDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  const posts = await Post.find(query).sort('-createdDate');
  res.json(posts);
});

app.get('/posts/:title', async (req, res) => {
  const post = await Post.findOne({ title: req.params.title });
  if (!post) return res.status(404).send('Post not found');
  res.json(post);
});

app.post('/posts', authenticateToken, async (req, res) => {
  const { title, description, tags, image } = req.body;
  const author = req.user.username;
  const post = new Post({ title, description, tags, image, author });

  try {
    await post.save();
    res.status(201).send('Post created');
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating post' });
  }
});


// create comment
app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    const { text } = req.body;
    const author = req.user.username;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
  
      const comment = new Comment({ text, author, postId });
      await comment.save();

      if (!post.comments) {
        post.comments = [];
      }
  
      post.comments.push(comment);
      post.commentCount += 1;
      await post.save();
  
      res.status(201).send({ message: 'Comment created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error creating comment' });
    }
  });
  

  // delete post by id
app.delete('/posts/:postId', authenticateToken, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const decodedToken = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);
    if (post.user.toString() !== decodedToken.username) {
      return res.status(403).send({ message: 'Unauthorized to delete post' });
    }

    await post.delete();
    res.send({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting post' });
  }
});

// delete comment by id
app.delete('/posts/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).send({ message: 'Comment not found' });
    }

    const decodedToken = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);
    if (post.comments[commentIndex].user.toString() !== decodedToken.username) {
      return res.status(403).send({ message: 'Unauthorized to delete comment' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    res.send({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting comment' });
  }
});
