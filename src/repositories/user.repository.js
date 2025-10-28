const userDAO = require('../dao/user.dao');

class UserRepository {
  async findById(id) {
    return await userDAO.findById(id);
  }

  async findByEmail(email) {
    return await userDAO.findByEmail(email);
  }

  async findAll() {
    return await userDAO.findAll();
  }

  async create(userData) {
    return await userDAO.create(userData);
  }

  async updateById(id, updateData) {
    return await userDAO.updateById(id, updateData);
  }

  async deleteById(id) {
    return await userDAO.deleteById(id);
  }
}

module.exports = new UserRepository();
