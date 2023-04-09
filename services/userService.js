const User = require('../models/user.model');

class UserService {
  async getUserByUsername(username) {
    return await User.findOne({ username });
  }
}

module.exports = UserService;
