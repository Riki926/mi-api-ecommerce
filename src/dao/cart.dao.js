const Cart = require('../models/Cart');

class CartDAO {
  async findById(id) {
    return await Cart.findById(id).populate('items.product');
  }

  async findByUserId(userId) {
    return await Cart.findOne({ user: userId }).populate('items.product');
  }

  async create(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async updateById(id, updateData) {
    return await Cart.findByIdAndUpdate(id, updateData, { new: true }).populate('items.product');
  }

  async deleteById(id) {
    return await Cart.findByIdAndDelete(id);
  }

  async clearItems(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { items: [] },
      { new: true }
    ).populate('items.product');
  }
}

module.exports = new CartDAO();
