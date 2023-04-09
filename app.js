const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { notFoundHandler, errorHandler } = require('./handlers');
const { authRoutes, postRoutes, commentRoutes } = require('./routes');

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
