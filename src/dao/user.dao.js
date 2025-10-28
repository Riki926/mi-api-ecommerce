const User = require('../models/User');

class UserDAO {
  async findById(id) {
    return await User.findById(id).populate('cart');
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() }).populate('cart');
  }

  async findAll() {
    return await User.find().select('_id email role');
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserDAO();
