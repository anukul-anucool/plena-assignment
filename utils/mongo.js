const mongoose = require('mongoose');
const { mongoURI } = require('../config/env');

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error: ' + err));

module.exports = mongoose;
