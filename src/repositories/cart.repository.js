const cartDAO = require('../dao/cart.dao');

class CartRepository {
  async findById(id) {
    return await cartDAO.findById(id);
  }

  async findByUserId(userId) {
    return await cartDAO.findByUserId(userId);
  }

  async create(cartData) {
    return await cartDAO.create(cartData);
  }

  async updateById(id, updateData) {
    return await cartDAO.updateById(id, updateData);
  }

  async deleteById(id) {
    return await cartDAO.deleteById(id);
  }

  async clearItems(cartId) {
    return await cartDAO.clearItems(cartId);
  }
}

module.exports = new CartRepository();
